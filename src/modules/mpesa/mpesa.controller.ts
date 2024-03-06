import { Body, Controller, Post } from '@nestjs/common';
import { MpesaService } from './mpesa.service';
import { LipaNaMpesaParams } from './interfaces/lipa-na-mpesa-params.interface';
import { MpesaProducer } from './mpesa.producer';

@Controller('mpesa')
export class MpesaController {
  constructor(
    private readonly mpesaService: MpesaService,
    private readonly mpesaProducer: MpesaProducer,
  ) {}

  @Post('lipa_na_mpesa')
  async lipaNaMpesa(@Body() request: LipaNaMpesaParams): Promise<any> {
    // return await this.mpesaService.createLipaNaMpesaRequest(
    //   request
    // );

    return await this.mpesaProducer.createLipaNaMpesaRequestViaProducer(
      request,
    );
  }
}
