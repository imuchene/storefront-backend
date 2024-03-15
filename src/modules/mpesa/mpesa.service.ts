import { HttpService } from '@nestjs/axios';
import {
  Inject,
  Injectable,
  Logger,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  AxiosBasicCredentials,
  AxiosError,
  AxiosHeaders,
  AxiosRequestConfig,
  AxiosResponse,
} from 'axios';
import { catchError, firstValueFrom } from 'rxjs';
import { MpesaAuth } from './interfaces/mpesa-auth.interface';
import { DateTime } from 'luxon';
import { MpesaTransactionTypes } from '../../common/enums/mpesa-transaction-types.enum';
import { LipaNaMpesaRequest } from './interfaces/lipa-na-mpesa-request.interface';
import * as uuid from 'uuid';
import { LipaNaMpesaResponse } from './interfaces/lipa-na-mpesa-response.interface';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { RedisKeys } from '../../common/enums/redis-keys.enum';
import * as util from 'util';
import { LipaNaMpesaParams } from './interfaces/lipa-na-mpesa-params.interface';

@Injectable()
export class MpesaService {
  private readonly logger = new Logger(MpesaService.name);
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  async generateOauthToken(): Promise<MpesaAuth> {
    const cachedToken: MpesaAuth = await this.cacheManager.get(
      RedisKeys.MpesaAuthToken,
    );

    if (cachedToken) {
      return cachedToken;
    }

    const darajaAuthpath = 'oauth/v1/generate?grant_type=client_credentials';
    const darajaUserName = this.configService.get<string>(
      'DARAJA_CONSUMER_KEY',
    );
    const darajaUserPassword = this.configService.get<string>(
      'DARAJA_CONSUMER_SECRET',
    );

    const auth: AxiosBasicCredentials = {
      username: darajaUserName,
      password: darajaUserPassword,
    };

    const config: AxiosRequestConfig = {
      auth: auth,
    };

    const url = this.configService.get<string>('DARAJA_URL') + darajaAuthpath;

    const { data }: AxiosResponse = await firstValueFrom(
      this.httpService.get(url, config).pipe(
        catchError((error: AxiosError) => {
          this.logger.error(error.response.data);
          // todo save failed payment request details
          throw new UnprocessableEntityException('[MpesaService] Auth Error');
        }),
      ),
    );

    const mpesaAuth: MpesaAuth = data;
    // Cache the auth token for 1 hour
    await this.cacheManager.set(
      RedisKeys.MpesaAuthToken,
      mpesaAuth,
      3599 * 1000,
    );
    return mpesaAuth;
  }

  async createLipaNaMpesaRequest(
    lipaNaMpesaParams: LipaNaMpesaParams,
  ): Promise<LipaNaMpesaResponse> {
    try {
      // todo save payment request info
      // todo save:     MerchantRequestID & CheckoutRequestID
      const lipaNaMpesaPath = 'mpesa/stkpush/v1/processrequest';
      const token = await this.generateOauthToken();

      const timestamp = DateTime.now().toFormat('yyyyLLddHHmmss');
      const shortcode = this.configService.get<string>(
        'DARAJA_BUSINESS_SHORTCODE',
      );

      const passkey = this.configService.get<string>('DARAJA_PASS_KEY');

      const password = Buffer.from(shortcode + passkey + timestamp).toString(
        'base64',
      );

      const transactionType = MpesaTransactionTypes.CustomerPayBillOnline;
      const callbackUrl = this.configService.get<string>('DARAJA_CALLBACK_URL');

      const lipaNaMpesaRequest: LipaNaMpesaRequest = {
        BusinessShortCode: shortcode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: transactionType,
        Amount: String(lipaNaMpesaParams.amount),
        PartyA: lipaNaMpesaParams.phoneNumber,
        PartyB: shortcode,
        PhoneNumber: lipaNaMpesaParams.phoneNumber,
        CallBackURL: callbackUrl,
        AccountReference: uuid.v4(),
        TransactionDesc: 'Lipa na Mpesa Request',
      };

      const headers = new AxiosHeaders();
      headers.setAuthorization(`Bearer ${token.access_token}`);

      const config: AxiosRequestConfig = {
        headers: headers,
      };

      const url =
        this.configService.get<string>('DARAJA_URL') + lipaNaMpesaPath;

      const { data }: AxiosResponse = await firstValueFrom(
        this.httpService.post(url, lipaNaMpesaRequest, config).pipe(
          catchError((error: AxiosError) => {
            this.logger.error(error.response.data);
            throw new UnprocessableEntityException(
              '[MpesaService] Lipa na Mpesa error',
            );
          }),
        ),
      );

      const lipaNaMpesaResponse: LipaNaMpesaResponse = data;
      return lipaNaMpesaResponse;
    } catch (error) {
      this.logger.error('Mpesa Error', util.inspect(error));
      throw new Error(error);
    }
  }
}
