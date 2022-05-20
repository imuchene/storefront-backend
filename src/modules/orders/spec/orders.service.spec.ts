import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ProductsService } from '../../products/products.service';
import { StripeService } from '../../stripe/stripe.service';
import { Order } from '../entities/order.entity';
import { OrdersService } from '../orders.service';

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
          provide: ProductsService,
          useValue: {},
        },
        {
          provide: StripeService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
