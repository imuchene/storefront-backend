import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
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
import { LipaNaMpesaCallback } from './interfaces/lipa-na-mpesa-callback.interface';

@Injectable()
export class MpesaService {
  private readonly logger = new Logger(MpesaService.name);
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async generateOauthToken(): Promise<MpesaAuth> {
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
          throw '[MpesaService] Auth Error';
        }),
      ),
    );

    const mpesaAuth: MpesaAuth = data;
    //todo cache the token before returning its
    return mpesaAuth;
  }

  async createLipaNaMpesaRequest(
    amount: number,
    phoneNumber: string,
  ): Promise<LipaNaMpesaResponse> {
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
    const callbackUrl = 'https://wwww.example.com';

    const lipaNaMpesaRequest: LipaNaMpesaRequest = {
      BusinessShortCode: shortcode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: transactionType,
      Amount: String(amount),
      PartyA: phoneNumber,
      PartyB: shortcode,
      PhoneNumber: phoneNumber,
      CallBackURL: callbackUrl,
      AccountReference: uuid.v4(),
      TransactionDesc: 'Lipa na Mpesa Request',
    };

    const headers = new AxiosHeaders();
    headers.setAuthorization(`Bearer ${token.access_token}`);

    const config: AxiosRequestConfig = {
      headers: headers,
    };

    const url = this.configService.get<string>('DARAJA_URL') + lipaNaMpesaPath;

    const { data }: AxiosResponse = await firstValueFrom(
      this.httpService.post(url, lipaNaMpesaRequest, config).pipe(
        catchError((error: AxiosError) => {
          this.logger.error(error.response.data);
          throw '[MpesaService] Lipa na Mpesa error';
        }),
      ),
    );

    const lipaNaMpesaResponse: LipaNaMpesaResponse = data;
    return lipaNaMpesaResponse;
  }

  async lipaNaMpesaCallback(callback: LipaNaMpesaCallback): Promise<string>{
    
    if (callback.Body.stkCallback.ResultCode === 0) {
      // Update the order's payment status to success
    }
    else {
    // Update the order's payment status to failed
    }

    return 'success';
  }
}
