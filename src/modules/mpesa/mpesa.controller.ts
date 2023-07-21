import { Body, Controller, Get, Post } from '@nestjs/common';
import { MpesaService } from './mpesa.service';
import { MpesaAuth } from './interfaces/mpesa-auth.interface';
import { LipaNaMpesaResponse } from './interfaces/lipa-na-mpesa-response.interface';

@Controller('mpesa')
export class MpesaController {
  constructor(private readonly mpesaService: MpesaService) {}

  @Get('test')
  async getToken(): Promise<MpesaAuth> {
    return this.mpesaService.generateOauthToken();
  }

  @Post('lipa_na_mpesa')
  async lipaNaMpesa(@Body() request: any): Promise<LipaNaMpesaResponse> {
    return this.mpesaService.createLipaNaMpesaRequest(
      request.amount,
      request.phoneNumber,
    );
  }
}
