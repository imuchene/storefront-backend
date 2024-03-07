import { Body, Controller, Post } from '@nestjs/common';
import { LipaNaMpesaParams } from './interfaces/lipa-na-mpesa-params.interface';
import { MpesaProducer } from './mpesa.producer';

@Controller('mpesa')
export class MpesaController {
  constructor(private readonly mpesaProducer: MpesaProducer) {}

  @Post('lipa_na_mpesa')
  async lipaNaMpesa(@Body() request: LipaNaMpesaParams): Promise<any> {
    return await this.mpesaProducer.createLipaNaMpesaRequestViaProducer(
      request,
    );
  }
}
