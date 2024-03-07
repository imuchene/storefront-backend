import { Module } from '@nestjs/common';
import { MpesaService } from './mpesa.service';
import { MpesaController } from './mpesa.controller';
import { HttpModule } from '@nestjs/axios';
import { BullModule } from '@nestjs/bull';
import { MpesaProcessor } from './mpesa.processor';
import { MpesaProducer } from './mpesa.producer';
import { QueueNames } from '../../common/enums/queue-names.enum';

@Module({
  imports: [
    HttpModule,
    BullModule.registerQueueAsync({ name: QueueNames.Mpesa }),
  ],
  providers: [MpesaService, MpesaProcessor, MpesaProducer],
  controllers: [MpesaController],
  exports: [MpesaService],
})
export class MpesaModule {}
