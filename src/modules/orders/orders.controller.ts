import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Request } from 'express';
import { Customer } from '../customers/entities/customer.entity';
import { Order } from './entities/order.entity';
import Stripe from 'stripe';
import { LipaNaMpesaCallback } from '../mpesa/interfaces/lipa-na-mpesa-callback.interface';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Body() createOrderDto: CreateOrderDto,
    @Req() req: Request,
  ): Promise<Order> {
    const customer = req.user as Customer;
    return this.ordersService.create(createOrderDto, customer);
  }

  @Post('stripe_webhook')
  async stripeWebhook(@Body() event: Stripe.Event): Promise<object> {
    await this.ordersService.stripeWebhook(event);
    return { message: 'success' };
  }

  @Post('lipa_na_mpesa_callback')
  async lipaNaMpesaCallback(
    @Body() callback: LipaNaMpesaCallback,
  ): Promise<object> {
    await this.ordersService.lipaNaMpesaCallback(callback);
    return { message: 'success' };
  }
}
