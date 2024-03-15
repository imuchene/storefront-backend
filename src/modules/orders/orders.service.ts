import {
  Injectable,
  Logger,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { Customer } from '../customers/entities/customer.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Repository, UpdateResult } from 'typeorm';
import { ProductsService } from '../products/products.service';
import { StripeService } from '../stripe/stripe.service';
import Stripe from 'stripe';
import { PaymentIntentEvent } from '../../common/enums/payment-intent-event.enum';
import { PaymentStatus } from '../../common/enums/payment-status.enum';
import { LipaNaMpesaCallback } from '../mpesa/interfaces/lipa-na-mpesa-callback.interface';
import { PaymentRequest } from '../payments/entities/payment-request.entity';
import { PaymentMethods } from '../../common/enums/payment-methods.enum';
import { LipaNaMpesaParams } from '../mpesa/interfaces/lipa-na-mpesa-params.interface';
import { MpesaProducer } from '../mpesa/mpesa.producer';

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);
  constructor(
    @InjectRepository(Order)
    private readonly ordersRepository: Repository<Order>,
    @InjectRepository(PaymentRequest)
    private readonly paymentRequestRepository: Repository<PaymentRequest>,
    private readonly productsService: ProductsService,
    private readonly stripeService: StripeService,
    private readonly mpesaProducer: MpesaProducer,
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
    if (products.length < 1 || products.length != productIds.length) {
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

    // Save the payment request
    await this.createPaymentRequest(savedOrder, createOrderDto.paymentMethod);

    if (createOrderDto.paymentMethod === PaymentMethods.Mpesa) {
      const lipaNaMpesaParams: LipaNaMpesaParams = {
        amount: Math.round(savedOrder.totalAmount),
        phoneNumber: customer.phoneNumber,
      };

      await this.mpesaProducer.createLipaNaMpesaRequestViaProducer(
        lipaNaMpesaParams,
      );

      return savedOrder;
    }

    // Create a payment intent on Stripe
    const paymentIntent = await this.stripeService.createPaymentIntent(
      savedOrder.id,
      savedOrder.totalAmount,
    );
    const clientSecret = paymentIntent.client_secret;

    // Return the client secret to the client as well as the saved order info
    const updatedOrder = {
      ...savedOrder,
      clientSecret: clientSecret,
      customerName: customer.name,
    };
    return updatedOrder;
  }

  async findOrder(id: string): Promise<Order> {
    return await this.ordersRepository.findOneByOrFail({ id });
  }

  async updateOrder(id: string, order: Order): Promise<UpdateResult> {
    await this.findOrder(id);
    return await this.ordersRepository.update(id, order);
  }

  async stripeWebhook(event: Stripe.Event): Promise<string> {
    // Fetch the orderId from the webhook metadata
    const orderId = event.data.object['metadata'].orderId;

    // Lookup the order
    const order = await this.findOrder(orderId);

    // Check the event type
    switch (event.type) {
      // If the event type is a succeeded, update the payment status to succeeded
      case PaymentIntentEvent.Succeeded:
        order.paymentStatus = PaymentStatus.Succeeded;
        break;

      case PaymentIntentEvent.Processing:
        // If the event type is processing, update the payment status to processing
        order.paymentStatus = PaymentStatus.Processing;
        break;

      case PaymentIntentEvent.Failed:
        // If the event type is payment_failed, update the payment status to payment_failed
        order.paymentStatus = PaymentStatus.Failed;
        break;

      default:
        // else, by default the payment status should remain as created
        order.paymentStatus = PaymentStatus.Created;
        break;
    }

    const updateResult = await this.updateOrder(orderId, order);

    if (updateResult.affected === 1) {
      return `Record successfully updated with Payment Status ${order.paymentStatus}`;
    } else {
      throw new UnprocessableEntityException(
        'The payment was not successfully updated',
      );
    }
  }

  async lipaNaMpesaCallback(callback: LipaNaMpesaCallback): Promise<string> {
    this.logger.log('callback', JSON.stringify(callback));
    if (callback.Body.stkCallback.ResultCode === 0) {
      // Update the order's payment status to success
    } else {
      // Update the order's payment status to failed
    }

    return 'success';
  }

  async createPaymentRequest(
    order: Order,
    paymentMethod: string,
  ): Promise<PaymentRequest> {
    let provider: string;

    switch (paymentMethod) {
      case PaymentMethods.Mpesa:
        provider = 'mpesa';
        break;

      case PaymentMethods.CreditCard:
        provider = 'stripe';
        break;

      case PaymentMethods.ExpressCheckout:
        provider = 'express_checkout';
        break;

      default:
        break;
    }

    const paymentRequest = new PaymentRequest({
      provider: provider,
      paymentMethod: paymentMethod,
      orderId: order.id,
      status: PaymentStatus.Processing,
    });
    return await this.paymentRequestRepository.save(paymentRequest);
  }
}
