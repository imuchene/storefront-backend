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
});
