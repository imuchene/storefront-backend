import { Controller, Get } from '@nestjs/common';
import { MpesaService } from './mpesa.service';
import { MpesaAuth } from './interfaces/mpesa-auth.interface';

@Controller('mpesa')
export class MpesaController {
  constructor(private readonly mpesaService: MpesaService) {}

  @Get('test')
  async getToken(): Promise<MpesaAuth> {
    return this.mpesaService.generateOauthToken();
  }
}
