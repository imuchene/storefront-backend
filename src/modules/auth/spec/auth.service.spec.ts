import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RedisService } from 'nestjs-redis';
import { CustomersService } from '../../customers/customers.service';
import { Customer } from '../../customers/entities/customer.entity';
import { AuthService } from '../auth.service';
import { JwtTokenPayload } from '../interfaces/jwt-payload.interface';
import * as bcrypt from 'bcrypt';
import { CreateCustomerDto } from '../../customers/dto/create-customer.dto';

describe('AuthService', () => {
  let service: AuthService;
  let customerService: CustomersService;
  const fakeCustomer = new Customer({
    id: '2173dd22-42ed-4091-bb46-aaca401efa45',
    name: 'Test Customer',
    email: 'testcustomer@example.com',
    phoneNumber: '0720123456',
    password: 'strongPassword',
  });
  let bcryptCompare: jest.Mock;

  let customerData: Customer;
  let findCustomer: jest.Mock;

  beforeEach(async () => {
    const getClient = jest.fn((data: any) => {
      return data;
    });

    const signAsync = jest.fn((data: JwtTokenPayload) => {
      return data.customerId;
    });

    const get = jest.fn();

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

    const mockConfigService = jest.fn().mockImplementation(() => {
      return {
        get: get,
      };
    });

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        CustomersService,
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
          useClass: mockConfigService,
        },
        {
          provide: getRepositoryToken(Customer),
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    customerService = module.get<CustomersService>(CustomersService);
    bcryptCompare = jest.fn().mockReturnValue(true);
    (bcrypt.compare as jest.Mock) = bcryptCompare;

    customerData = { ...fakeCustomer };
    findCustomer = jest.fn().mockResolvedValue(customerData);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('should return the customer details', async () => {
      let customer: Promise<Customer>;
      const registrationData = new CreateCustomerDto();
      jest.spyOn(service, 'register').mockImplementation(() => customer);
      expect(await service.register(registrationData)).toBe(customer);
    });
  });

  describe('when creating a jwt access token', () => {
    it('should return a string', async () => {
      expect(typeof (await service.createJwtAccessToken(fakeCustomer))).toEqual(
        'string',
      );
    });
  });

  describe('when creating a jwt refresh token', () => {
    it('should return a string', async () => {
      let result: Promise<string>;
      const testRefreshTokenId = '2173dd22-42ed-4091-bb46-aaca401efa46';
      jest
        .spyOn(service, 'createJwtRefreshToken')
        .mockImplementation(() => result);
      expect(
        await service.createJwtRefreshToken(
          fakeCustomer.id,
          testRefreshTokenId,
        ),
      ).toBe(result);
    });
  });

  describe('when validating a jwt refresh token', () => {
    it('should return the customer details', async () => {
      let result: Promise<Customer>;
      const testRefreshToken = 'testrefreshtoken';
      const testRefreshTokenId = '2173dd22-42ed-4091-bb46-aaca401efa46';
      jest
        .spyOn(service, 'validateJwtRefreshToken')
        .mockImplementation(() => result);
      expect(
        await service.validateJwtRefreshToken(
          fakeCustomer.id,
          testRefreshToken,
          testRefreshTokenId,
        ),
      ).toBe(result);
    });
  });

  describe('when deleting a jwt refresh token', () => {
    it('should return the customer details', async () => {
      let result: Promise<Customer>;
      const testRefreshTokenId = '2173dd22-42ed-4091-bb46-aaca401efa46';
      jest
        .spyOn(service, 'removeJwtRefreshToken')
        .mockImplementation(() => result);
      expect(
        await service.removeJwtRefreshToken(
          fakeCustomer.id,
          testRefreshTokenId,
        ),
      ).toBe(result);
    });
  });

  describe('when accessing the data of an authenticating customer', () => {
    describe('and the provided password is not valid', () => {
      beforeEach(() => {
        bcryptCompare.mockReturnValue(false);
      });

      it('should throw an error', async () => {
        await expect(
          service.getAuthenticatedCustomer(
            fakeCustomer.email,
            fakeCustomer.password,
          ),
        ).rejects.toThrow();
      });
    });

    describe('and the provided password is valid', () => {
      beforeEach(() => {
        bcryptCompare.mockReturnValue(true);
      });

      describe('and the customer is found in the database', () => {
        beforeEach(() => {
          findCustomer.mockReturnValue(customerData);
        });

        it('should return the customer data', async () => {
          try {
            const customer = await service.getAuthenticatedCustomer(
              fakeCustomer.email,
              fakeCustomer.password,
            );
            expect(customer).toBe(customerData);
          } catch (error) {
            console.log('[authService spec] error', error);
          }
        });
      });

      describe('and the customer is not found in the database', () => {
        beforeEach(() => {
          findCustomer.mockResolvedValue(undefined);
        });

        it('should throw an error', async () => {
          await expect(
            service.getAuthenticatedCustomer(
              fakeCustomer.email,
              fakeCustomer.password,
            ),
          ).rejects.toThrow();
        });
      });
    });

    it('should attempt to get the customer by email', async () => {
      const getByEmailSpy = jest.spyOn(customerService, 'getByEmail');
      try {
        await service.getAuthenticatedCustomer(
          'user@email.com',
          'strongPassword',
        );
      } catch (error) {
        expect(getByEmailSpy).toBeCalledTimes(1);
      }
    });
  });
});
