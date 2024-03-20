import { Test, TestingModule } from '@nestjs/testing';
import { CanActivate, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { JwtAuthGuard } from '../src/modules/auth/guards/jwt-auth.guard';
import cookieParser from 'cookie-parser';
import { OrdersService } from '../src/modules/orders/orders.service';

describe('OrdersController (e2e)', () => {
  let app: INestApplication;
  const mockAuthGuard: CanActivate = { canActivate: () => true };
  const mockOrdersService = {
    create: () => {
      return {
        customerId: '1660be29-204e-4bfa-a68e-23ecb042d8c3',
        totalAmount: 55.25,
        orderItems: [
          {
            productId: '2f3b4332-1189-4a95-aed1-d8a243e7bacb',
            quantity: 2,
            unitPrice: 12.13,
            orderId: '374eb139-cd27-4829-aeb1-220844fc0414',
          },
          {
            productId: '43efaa10-ffc2-4c24-a05b-5aef6237b5c1',
            quantity: 3,
            unitPrice: 10.33,
            orderId: '374eb139-cd27-4829-aeb1-220844fc0414',
          },
        ],
        id: '374eb139-cd27-4829-aeb1-220844fc0413',
        paymentStatus: 'Created',
        createdAt: '2022-06-07T14:10:49.101Z',
        updatedAt: '2022-06-07T14:10:49.101Z',
        clientSecret: 'pi_test_client_secret',
      };
    },
    stripeWebhook: () => {
      return { message: 'success' };
    },
  };

  beforeAll(async () => {
    jest.setTimeout(30 * 1000);

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue(mockAuthGuard)
      .overrideProvider(OrdersService)
      .useValue(mockOrdersService)
      .compile();

    app = moduleFixture.createNestApplication();
    app.use(cookieParser('testString'));
    await app.init();
  });

  describe('order creation', () => {
    it('returns an order object', () => {
      return request(app.getHttpServer())
        .post('/orders')
        .expect(201)
        .expect(mockOrdersService.create());
    });
  });

  describe('stripe callback', () => {
    it('updates the order payment status via the webhook', () => {
      return request(app.getHttpServer())
        .post('/orders/stripe_webhook')
        .expect(201)
        .expect(mockOrdersService.stripeWebhook());
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
