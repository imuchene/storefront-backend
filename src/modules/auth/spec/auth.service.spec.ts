import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { RedisService } from 'nestjs-redis';
import { CustomersService } from '../../customers/customers.service';
import { Customer } from '../../customers/entities/customer.entity';
import { AuthService } from '../auth.service';
import { JwtTokenPayload } from '../interfaces/jwt-payload.interface';

describe('AuthService', () => {
  let service: AuthService;
  const fakeCustomer = new Customer({
    id: 'edbf2b87-5d30-4430-8f67-4bb92a20ef36',
    name: 'Test Customer',
  });

  beforeEach(async () => {
    const getClient = jest.fn((data: any) => {
      return data;
    });

    const signAsync = jest.fn((data: JwtTokenPayload) => {
      return data.customerId;
    });

    const mockRedisService = jest.fn().mockImplementation(() => {
      return {
        getClient: getClient,
      };
    });

    const mockJwtService = jest.fn().mockImplementation(() => {
      return {
        signAsync: signAsync,
      };
    });

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: CustomersService,
          useValue: {},
        },
        {
          provide: JwtService,
          useClass: mockJwtService,
        },
        {
          provide: RedisService,
          useClass: mockRedisService,
        },
        {
          provide: ConfigService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('when creating a cookie', () => {
    it('should return a string', async () => {
      expect(typeof (await service.createJwtAccessToken(fakeCustomer))).toEqual(
        'string',
      );
    });
  });
});
