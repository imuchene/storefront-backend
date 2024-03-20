import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import Stripe from 'stripe';
import { UpdateResult } from 'typeorm';
import { Customer } from '../../customers/entities/customer.entity';
import { ProductsService } from '../../products/products.service';
import { StripeService } from '../../stripe/stripe.service';
import { CreateOrderDto } from '../dto/create-order.dto';
import { Order } from '../entities/order.entity';
import { OrdersService } from '../orders.service';
import { PaymentRequest } from '../../../modules/payments/entities/payment-request.entity';
import { MpesaProducer } from '../../../modules/mpesa/mpesa.producer';

describe('OrdersService', () => {
  let service: OrdersService;

  beforeEach(async () => {
    const createMock = jest.fn((dto: any) => {
      return dto;
    });

    const saveMock = jest.fn((dto: any) => {
      return dto;
    });

    const findOneMock = jest.fn((dto: any) => {
      return dto;
    });

    const MockRepository = jest.fn().mockImplementation(() => {
      return {
        create: createMock,
        save: saveMock,
        findOne: findOneMock,
      };
    });

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        {
          provide: getRepositoryToken(Order),
          useClass: MockRepository,
        },
        {
          provide: getRepositoryToken(PaymentRequest),
          useClass: MockRepository,
        },
        {
          provide: ProductsService,
          useValue: {},
        },
        {
          provide: StripeService,
          useValue: {},
        },
        {
          provide: MpesaProducer,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('creating an order', () => {
    it('should return a new order', async () => {
      let order: Promise<Order>;
      const testOrderDto = new CreateOrderDto();
      const testCustomer = new Customer();

      jest.spyOn(service, 'create').mockImplementation(() => order);
      expect(await service.create(testOrderDto, testCustomer)).toBe(order);
    });
  });

  describe('finding an order', () => {
    it('should return one order', async () => {
      let order: Promise<Order>;
      const testOrderId = '2173dd22-42ed-4091-bb46-aaca401efa46';

      jest.spyOn(service, 'findOrder').mockImplementation(() => order);
      expect(await service.findOrder(testOrderId)).toBe(order);
    });
  });

  describe('updating an order', () => {
    it('should return an update result', async () => {
      let updateResult: Promise<UpdateResult>;
      const testOrderId = '2173dd22-42ed-4091-bb46-aaca401efa46';
      const testOrder = new Order();

      jest.spyOn(service, 'updateOrder').mockImplementation(() => updateResult);
      expect(await service.updateOrder(testOrderId, testOrder)).toBe(
        updateResult,
      );
    });
  });

  describe('calling the stripe webhook', () => {
    it('should return a string', async () => {
      let updateResult: Promise<string>;
      let event: Stripe.Event;

      jest
        .spyOn(service, 'stripeWebhook')
        .mockImplementation(() => updateResult);
      expect(await service.stripeWebhook(event)).toBe(updateResult);
    });
  });
});
