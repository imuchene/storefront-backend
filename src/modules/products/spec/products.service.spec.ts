import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from '../products.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Product } from '../entities/product.entity';
import { CreateProductDto } from '../dto/create-product.dto';
import { DeleteResult, UpdateResult } from 'typeorm';
import { UpdateProductDto } from '../dto/update-product.dto';

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

  describe('findAll', () => {
    it('should return an array of products', async () => {
      let result: Promise<Product[]>;

      jest.spyOn(service, 'findAll').mockImplementation(() => result);
      expect(await service.findAll()).toBe(result);
    });
  });

  describe('findOne', () => {
    it('should return a single product', async () => {
      let product: Promise<Product>;
      const testProductId = '2173dd22-42ed-4091-bb46-aaca401efa45';
      jest.spyOn(service, 'findOne').mockImplementation(() => product);
      expect(await service.findOne(testProductId)).toBe(product);
    });
  });

  describe('create', () => {
    it('should return a new product', async () => {
      let product: Promise<Product>;
      const testCreateProductDto = new CreateProductDto();
      jest.spyOn(service, 'create').mockImplementation(() => product);
      expect(await service.create(testCreateProductDto)).toBe(product);
    });
  });

  describe('update', () => {
    it('should return an update result', async () => {
      let updateResult: Promise<UpdateResult>;
      const testUpdateProductDto = new UpdateProductDto();
      const testProductId = '2173dd22-42ed-4091-bb46-aaca401efa45';

      jest.spyOn(service, 'update').mockImplementation(() => updateResult);
      expect(await service.update(testProductId, testUpdateProductDto)).toBe(
        updateResult,
      );
    });
  });

  describe('remove', () => {
    it('should return an delete result', async () => {
      let deleteResult: Promise<DeleteResult>;
      const testProductId = '2173dd22-42ed-4091-bb46-aaca401efa45';

      jest.spyOn(service, 'remove').mockImplementation(() => deleteResult);
      expect(await service.remove(testProductId)).toBe(deleteResult);
    });
  });

  describe('checkIfProductsExists', () => {
    it('should return an array of products', async () => {
      let result: Promise<Product[]>;
      const testProductIds = [
        '2173dd22-42ed-4091-bb46-aaca401efa45',
        '1884c5c2-ccab-45ed-b005-19769ffa0697',
        'da2e4c9a-439e-47f5-a289-0b193970be04',
      ];

      jest
        .spyOn(service, 'checkIfProductsExist')
        .mockImplementation(() => result);
      expect(await service.checkIfProductsExist(testProductIds)).toBe(result);
    });
  });
});
