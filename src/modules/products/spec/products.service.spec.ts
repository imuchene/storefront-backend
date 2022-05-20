import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from '../products.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Product } from '../entities/product.entity';

describe('ProductsService', () => {
  let service: ProductsService;

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

    const mockRepository = jest.fn().mockImplementation(() => {
      return {
        create: createMock,
        save: saveMock,
        findOne: findOneMock,
      };
    });

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getRepositoryToken(Product),
          useClass: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
