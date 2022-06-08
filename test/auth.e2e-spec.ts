import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { Customer } from '../src/modules/customers/entities/customer.entity';
import { faker } from '@faker-js/faker';
import * as cookieParser from 'cookie-parser';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  const testPassword = faker.random.alpha(10);
  const testFirstName = faker.name.firstName();
  const testLastName = faker.name.lastName();
  const fakeCustomer = new Customer({
    name: testFirstName + ' ' + testLastName,
    email: `${testFirstName.toLowerCase()}@example.com`,
    phoneNumber: faker.phone.imei(),
    password: testPassword,
    confirmPassword: testPassword,
  });

  beforeAll(async () => {
    jest.setTimeout(30 * 1000);

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    app.use(cookieParser('testString'));
    await app.init();
  });

  describe('when registering', () => {
    describe('and using valid data', () => {
      it('should respond with the customer data minus the password', () => {
        return request(app.getHttpServer())
          .post('/auth/register')
          .send({
            email: fakeCustomer.email,
            name: fakeCustomer.name,
            phoneNumber: fakeCustomer.phoneNumber,
            password: fakeCustomer.password,
            confirmPassword: fakeCustomer.confirmPassword,
          })
          .expect(201);
      });

      it('should throw an error when a duplicate user is registered', () => {
        return request(app.getHttpServer())
          .post('/auth/register')
          .send({
            email: fakeCustomer.email,
            name: fakeCustomer.name,
            phoneNumber: fakeCustomer.phoneNumber,
            password: fakeCustomer.password,
            confirmPassword: fakeCustomer.confirmPassword,
          })
          .expect(400);
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

  describe('when logging in', () => {
    describe('and using valid data', () => {
      it('should respond with a success message', () => {
        return request(app.getHttpServer())
          .post('/auth/login')
          .send({
            email: fakeCustomer.email,
            password: fakeCustomer.password,
          })
          .expect(201)
          .expect({
            msg: 'success',
          });
      });
    });

    describe('and using invalid data', () => {
      it('should respond with a bad request error message', () => {
        return request(app.getHttpServer())
          .post('/auth/login')
          .send({
            email: 'fake@fake.com',
            password: 'fakepassword',
          })
          .expect(400)
          .expect({
            statusCode: 400,
            message: 'Wrong credentials provided',
            error: 'Bad Request',
          });
      });
    });
  });

  describe('when logging out', () => {
    describe('and using an invalid cookie', () => {
      it('should respond with an unauthorized message', () => {
        return request(app.getHttpServer()).delete('/auth/log_out').expect(401);
      });
    });
  });

  describe('when getting a refresh token', () => {
    describe('without a valid jwt token', () => {
      it('should respond with an unauthorized message', () => {
        return request(app.getHttpServer())
          .get('/auth/refresh_token')
          .expect(401);
      });
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
