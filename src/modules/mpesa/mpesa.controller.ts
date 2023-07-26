import { Body, Controller, Post } from '@nestjs/common';
import { MpesaService } from './mpesa.service';
import { LipaNaMpesaResponse } from './interfaces/lipa-na-mpesa-response.interface';

@Controller('mpesa')
export class MpesaController {
  constructor(private readonly mpesaService: MpesaService) {}

  @Post('lipa_na_mpesa')
  async lipaNaMpesa(@Body() request: any): Promise<LipaNaMpesaResponse> {
    return this.mpesaService.createLipaNaMpesaRequest(
      request.amount,
      request.phoneNumber,
    );
  }
}
