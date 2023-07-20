import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  AxiosBasicCredentials,
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
} from 'axios';
import { catchError, firstValueFrom } from 'rxjs';
import { MpesaAuth } from './interfaces/mpesa-auth.interface';

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
          throw 'An error happened';
        }),
      ),
    );

    const mpesaAuth: MpesaAuth = data;
    return mpesaAuth;
  }
}
