import { Test, TestingModule } from '@nestjs/testing';
import { CanActivate, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { JwtAuthGuard } from '../src/modules/auth/guards/jwt-auth.guard';
import cookieParser from 'cookie-parser';
import { ProductsService } from '../src/modules/products/products.service';
import { DeleteResult, UpdateResult } from 'typeorm';

describe('ProductsController (e2e)', () => {
  let app: INestApplication;
  const mockAuthGuard: CanActivate = { canActivate: () => true };

  const mockProductObject = {
    name: 'Test Product 03',
    unitPrice: 10.13,
    description: 'Test Product 03',
    imageUrl: 'http://www.fake-url.com/image.jpg',
    id: '10335531-df60-4c24-9597-8ce13d841929',
    createdAt: '2022-06-08T13:57:28.247Z',
    updatedAt: '2022-06-08T13:57:28.247Z',
    deletedAt: null,
  };

  const mockTypeormResult: UpdateResult | DeleteResult = {
    generatedMaps: [],
    raw: [],
    affected: 1,
  };

  const mockProductsService = {
    create: () => {
      return mockProductObject;
    },
    findOne: () => {
      return mockProductObject;
    },
    findAll: () => {
      return Array(5).fill(mockProductObject);
    },
    update: () => {
      return mockTypeormResult;
    },
    remove: () => {
      return mockTypeormResult;
    },
  };

  beforeAll(async () => {
    jest.setTimeout(30 * 1000);

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue(mockAuthGuard)
      .overrideProvider(ProductsService)
      .useValue(mockProductsService)
      .compile();

    app = moduleFixture.createNestApplication();
    app.use(cookieParser('testString'));
    await app.init();
  });

  describe('product creation', () => {
    it('returns a product object', () => {
      return request(app.getHttpServer())
        .post('/products')
        .expect(201)
        .expect(mockProductsService.create());
    });
  });

  describe('find all products', () => {
    it('returns an array of products', () => {
      return request(app.getHttpServer())
        .get('/products')
        .expect(200)
        .then((response) => {
          expect(response.body).toBeInstanceOf(Array);
        });
    });
  });

  describe('updating a product', () => {
    it('returns an update result', () => {
      return request(app.getHttpServer())
        .patch(`/products/${mockProductObject.id}`)
        .send({ name: 'Berries' })
        .expect(200)
        .expect(mockProductsService.update());
    });
  });

  describe('deleting a product', () => {
    it('returns a delete result', () => {
      return request(app.getHttpServer())
        .delete(`/products/${mockProductObject.id}`)
        .expect(200)
        .expect(mockProductsService.remove());
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
