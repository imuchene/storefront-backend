import { Module } from '@nestjs/common';
import { MpesaService } from './mpesa.service';
import { HttpModule } from '@nestjs/axios';
import { MpesaConsumer } from './mpesa.consumer';
import { MpesaProducer } from './mpesa.producer';

@Module({
  imports: [HttpModule],
  providers: [MpesaService, MpesaConsumer, MpesaProducer],
  exports: [MpesaService, MpesaProducer],
})
export class MpesaModule {}
