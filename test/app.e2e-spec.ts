import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { Customer } from '../src/modules/customers/entities/customer.entity';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let customerData: Customer;
  const fakeCustomer = new Customer({
    id: '2173dd22-42ed-4091-bb46-aaca401efa45',
    name: 'Test Customer',
    email: 'testcustomer@example.com',
    phoneNumber: '0720123456',
    password: 'strongPassword',
    confirmPassword: 'strongPassword',
  });

  beforeAll(async () => {
    customerData = { ...fakeCustomer };
    jest.setTimeout(30 * 1000);

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  describe('when registering', () => {
    describe('and using valid data', () => {
      it('should respond with the customer data minus the password', () => {
        const expectedData = { ...customerData };

        return request(app.getHttpServer())
          .post('/auth/register')
          .send({
            email: fakeCustomer.email,
            name: fakeCustomer.name,
            phoneNumber: fakeCustomer.phoneNumber,
            password: fakeCustomer.password,
            confirmPassword: fakeCustomer.confirmPassword,
          })
          .expect(201)
          .expect(expectedData);
      });
    });

    describe('and using invalid data', () => {
      it('should throw an error', () => {
        return request(app.getHttpServer())
          .post('/auth/register')
          .send({
            name: fakeCustomer.name,
          })
          .expect(400);
      });
    });
  });
});
