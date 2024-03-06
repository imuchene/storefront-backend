import { Module } from '@nestjs/common';
import { MpesaService } from './mpesa.service';
import { MpesaController } from './mpesa.controller';
import { HttpModule } from '@nestjs/axios';
import { BullModule } from '@nestjs/bull';
import { MpesaProcessor } from './mpesa.processor';
import { MpesaProducer } from './mpesa.producer';

@Module({
  // todo add enums for queue names
  imports: [HttpModule, BullModule.registerQueueAsync({ name: 'mpesa' })],
  providers: [MpesaService, MpesaProcessor, MpesaProducer],
  controllers: [MpesaController],
  exports: [MpesaService],
})
export class MpesaModule {}
