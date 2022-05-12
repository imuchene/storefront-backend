import {
  Injectable,
  Logger,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Customer } from '../customers/entities/customer.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Repository } from 'typeorm';
import { ProductsService } from '../products/products.service';
import { StripeService } from '../stripe/stripe.service';
import { Stripe } from 'stripe';
import * as util from 'util';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly ordersRepository: Repository<Order>,
    private readonly productsService: ProductsService,
    private readonly stripeService: StripeService,
  ) {}

  async create(
    createOrderDto: CreateOrderDto,
    customer: Customer,
  ): Promise<Order> {
    // Check if the products in the order exist
    const productIds = createOrderDto.orderItems.map((item) => item.productId);
    const products = await this.productsService.checkIfProductsExist(
      productIds,
    );

    // If none of the products in the order exist, or only some exist, while others
    // do not, throw an exception
    if (!products || products.length != productIds.length) {
      throw new UnprocessableEntityException(
        'The order could not be processed',
      );
    }

    const order = new Order({
      customerId: customer.id,
      totalAmount: createOrderDto.totalAmount,
    });

    order.orderItems = createOrderDto.orderItems;

    // Save the order including its order items as a transaction
    const savedOrder = await this.ordersRepository.save(order);

    Logger.log('saved order', util.inspect(savedOrder));

    // Create a payment intent on Stripe
    const paymentIntent = await this.stripeService.createPaymentIntent(
      savedOrder.id,
      savedOrder.totalAmount,
    );
    const clientSecret = paymentIntent.client_secret;

    // Return the client secret to the client as well as the saved order info
    const updatedOrder = { ...savedOrder, clientSecret: clientSecret };
    return updatedOrder;
  }

  async findOrder(id: string): Promise<Order> {
    return await this.ordersRepository.findOneOrFail(id);
  }

  async updateOrder(id: string, order: Order) {
    await this.findOrder(id);
    await this.ordersRepository.update(id, order);
  }

  async updatePaymentStatus(event: Stripe.Event) {
    Logger.log('stripe data', util.inspect(event));
    Logger.log(
      'stripe webhook metadata',
      util.inspect(event.data.object['metadata']),
    );
    Logger.log('stripe webhook metadata type', util.inspect(event.type));

    // Lookup the order

    // Check the event type

    switch (event.type) {
      case 'payment_intent.succeeded':
        break;

      case 'payment_intent.processing':
        break;

      case 'payment_intent.payment_failed':
        break;

      default:
        break;
    }

    // If the event type is a succeeded, update the payment status to succeeded

    // If the event type is processing, update the payment status to processing

    // If the event type is payment_failed, update the payment status to payment_failed
  }
}
