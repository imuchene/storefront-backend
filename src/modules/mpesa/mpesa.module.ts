import { Module } from '@nestjs/common';
import { MpesaService } from './mpesa.service';
import { MpesaController } from './mpesa.controller';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentRequest } from '../payments/entities/payment-request.entity';
import { OrderPayment } from '../payments/entities/order-payment.entity';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([PaymentRequest, OrderPayment]),
  ],
  providers: [MpesaService],
  controllers: [MpesaController],
})
export class MpesaModule {}
