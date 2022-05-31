import { UnprocessableEntityException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { Stripe } from 'stripe';
import { StripeService } from '../stripe.service';

describe('StripeService', () => {
  let service: StripeService;

  beforeEach(async () => {
    const mockGetFunction = jest.fn((data: any) => {
      return data;
    });

    const mockConfigService = jest.fn().mockImplementation(() => {
      return {
        get: mockGetFunction,
      };
    });

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StripeService,
        {
          provide: ConfigService,
          useClass: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<StripeService>(StripeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('creating a payment intent', () => {
    it('throws an error when orderId and totalAmount are not provided', async () => {
      expect.assertions(2);

      try {
        await service.createPaymentIntent('', 0);
      } catch (error) {
        expect(error).toBeInstanceOf(UnprocessableEntityException);
        expect(error.message).toBe('The payment intent could not be created');
      }
    });

    it('should return a new payment intent', async () => {
      let testPaymentIntent: Promise<Stripe.PaymentIntent>;
      const testOrderId = '21b2090a-d74c-47de-add8-af60d4903123';
      const testTotalAmount = 50;

      jest
        .spyOn(service, 'createPaymentIntent')
        .mockImplementation(() => testPaymentIntent);
      expect(
        await service.createPaymentIntent(testOrderId, testTotalAmount),
      ).toBe(testPaymentIntent);
    });
  });
});
