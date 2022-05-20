import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
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
});
