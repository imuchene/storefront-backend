import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CustomersService } from '../customers/customers.service';
import { CreateCustomerDto } from '../customers/dto/create-customer.dto';
import * as bcrypt from 'bcrypt';
import { PostgresErrorCode } from '../../common/enums/postgres-error-codes.enum';
import { Customer } from '../customers/entities/customer.entity';
import { JwtTokenPayload } from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';
import * as util from 'util';
import { RedisService } from 'nestjs-redis';
import { Redis } from 'ioredis';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class AuthService {
  redisClient: Redis;
  payload: JwtTokenPayload;

  constructor(
    private readonly customersService: CustomersService,
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
    private readonly configService: ConfigService,
  ) {
    this.redisClient = this.redisService.getClient();
  }

  async register(registrationData: CreateCustomerDto): Promise<Customer> {
    if (registrationData.password !== registrationData.confirmPassword) {
      throw new UnprocessableEntityException('Passwords are not matching.');
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(registrationData.password, salt);

    try {
      return await this.customersService.create({
        ...registrationData,
        password: hashedPassword,
      });
    } catch (error) {
      if (error?.code === PostgresErrorCode.UniqueViolation) {
        throw new BadRequestException(
          'Customer with that email already exists',
        );
      }

      Logger.error('error', util.inspect(error));
      throw new InternalServerErrorException(
        'Something went wrong during registration',
      );
    }
  }

  async getAuthenticatedCustomer(
    email: string,
    plainTextPassword: string,
  ): Promise<Customer> {
    try {
      const customer = await this.customersService.getByEmail(email);
      await this.verifyPassword(plainTextPassword, customer.password);
      return customer;
    } catch (error) {
      throw new BadRequestException('Wrong credentials provided');
    }
  }

  private async verifyPassword(
    plainTextPassword: string,
    hashedPassword: string,
  ) {
    const isPasswordMatching = await bcrypt.compare(
      plainTextPassword,
      hashedPassword,
    );
    if (!isPasswordMatching) {
      throw new BadRequestException('Wrong credentials provided');
    }
  }

  async createJwtAccessToken(customer: Customer): Promise<string> {
    this.payload = {
      customerId: customer.id,
    };
    return await this.jwtService.signAsync(this.payload);
  }

  async createJwtRefreshToken(
    customerId: string,
    refreshTokenId: string,
  ): Promise<string> {
    this.payload = {
      customerId: customerId,
    };
    const refreshToken = await this.jwtService.signAsync(this.payload, {
      secret: this.configService.get('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn: this.configService.get('JWT_REFRESH_TOKEN_EXPIRATION_TIME'),
    });

    // Encrypt the refresh token before storing it in redis
    const salt = await bcrypt.genSalt();
    const hashedRefreshToken = await bcrypt.hash(refreshToken, salt);

    // Save the hashed access token in redis and set it to expire after a day
    const redisResponse = await this.redisClient.setex(
      `refresh-token:${customerId}:${refreshTokenId}`,
      86400,
      hashedRefreshToken,
    );

    // Return the unencrypted refresh token back to the customer
    if (redisResponse === 'OK') {
      return refreshToken;
    }
  }

  async validateRefreshToken(
    customerId: string,
    refreshToken: string,
    refreshTokenId: string,
  ): Promise<Customer> {
    const customer = await this.customersService.getById(customerId);

    // Fetch the encrypted refresh token from redis
    const savedRefreshToken = await this.redisClient.get(
      `refresh-token:${customer.id}:${refreshTokenId}`,
    );

    // Compare the received refresh token and  what is stored in redis
    const isRefreshTokenMatching = await bcrypt.compare(
      refreshToken,
      savedRefreshToken,
    );

    if (!isRefreshTokenMatching) {
      throw new BadRequestException('The refresh tokens do not match');
    }

    if (savedRefreshToken) {
      return customer;
    } else {
      throw new NotFoundException('The refresh token was not found');
    }
  }
}
