import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Request } from 'express';
import { Customer } from '../customers/entities/customer.entity';
import { Stripe } from 'stripe';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createOrderDto: CreateOrderDto, @Req() req: Request) {
    const customer = req.user as Customer;
    return this.ordersService.create(createOrderDto, customer);
  }

  @Post('stripe_webhook')
  async webhook(@Body() event: Stripe.Event) {
    await this.ordersService.updatePaymentStatus(event);
    return { message: 'success' };
  }
}
