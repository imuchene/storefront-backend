import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CustomersService } from '../customers/customers.service';
import { CreateCustomerDto } from '../customers/dto/create-customer.dto';
import * as bcrypt from 'bcrypt';
import { PostgresErrorCode } from '../../common/enums/postgres-error-codes.enum';
import { Customer } from '../customers/entities/customer.entity';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as util from 'util';

@Injectable()
export class AuthService {
  constructor(
    private readonly customersService: CustomersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    ) {}

  async register(registrationData: CreateCustomerDto): Promise<Customer> {

    if(registrationData.password !== registrationData.confirmPassword){
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
      await this.verifyPassword(plainTextPassword, customer.password)
      return customer;
    } catch (error) {
      throw new BadRequestException('Wrong credentials provided');
    }
  }

  private async verifyPassword(plainTextPassword: string, hashedPassword: string){
    const isPasswordMatching = await bcrypt.compare(plainTextPassword, hashedPassword);
    if (!isPasswordMatching) {
      throw new BadRequestException('Wrong credentials provided');
    }
  }

  async createJwtToken(customer: Customer): Promise<string>{
    const payload: JwtPayload ={
      customerId: customer.id,
    };
    return await this.jwtService.signAsync(payload);
  }
}
