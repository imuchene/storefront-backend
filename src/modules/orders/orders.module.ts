import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { ProductsModule } from '../products/products.module';
import { StripeModule } from '../stripe/stripe.module';
import { PaymentRequest } from '../payments/entities/payment-request.entity';
import { OrderPayment } from '../payments/entities/order-payment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Order, PaymentRequest, OrderPayment]), ProductsModule, StripeModule],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}
