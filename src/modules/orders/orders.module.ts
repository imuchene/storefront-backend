import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { ProductsModule } from '../products/products.module';
import { StripeModule } from '../stripe/stripe.module';

@Module({
  imports: [TypeOrmModule.forFeature([Order]), ProductsModule, StripeModule],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
