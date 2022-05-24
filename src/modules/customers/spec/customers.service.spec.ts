import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CustomersService } from '../customers.service';
import { Customer } from '../entities/customer.entity';

describe('CustomersService', () => {
  let service: CustomersService;

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
        CustomersService,
        {
          provide: getRepositoryToken(Customer),
          useClass: MockRepository,
        },
      ],
    }).compile();

    service = module.get<CustomersService>(CustomersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('when getting a customer by email', () => {
    const customer = new Customer({});
    const testEmail = 'test@test.com'

    describe('and the customer is matched', () => {
      it('should return the customer', async () => {
        jest.spyOn(service, 'getByEmail').mockImplementation(async () => customer);
        expect(await service.getByEmail(testEmail)).toBe(customer);
      });

    });


    describe('and the customer is not matched', () => {
      it('should throw an error', async () => {
        jest.spyOn(service, 'getByEmail').mockRejectedValue(new Error('Customer with this email does not exist'));
        await expect(service.getByEmail(testEmail)).rejects.toThrow();
      });
    });

  });

  describe('when getting a customer by id', () => {
    const customer = new Customer({});
    const testId = '59f78b6b-b1fb-4cf3-ade1-608f37a9d3fa'

    describe('and the customer is matched', () => {
      it('should return the customer', async () => {
        jest.spyOn(service, 'getById').mockImplementation(async () => customer);
        expect(await service.getById(testId)).toBe(customer);
      });

    });


    describe('and the customer is not matched', () => {
      it('should throw an error', async () => {
        jest.spyOn(service, 'getById').mockRejectedValue(new Error('Customer with this id does not exist'));
        await expect(service.getById(testId)).rejects.toThrow();
      });
    });

  });


});
