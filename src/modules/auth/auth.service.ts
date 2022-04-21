import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CustomersService } from '../customers/customers.service';
import { CreateCustomerDto } from '../customers/dto/create-customer.dto';
import * as bcrypt from 'bcrypt';
import { PostgresErrorCode } from '../../common/enums/postgres-error-codes.enum';
import { Customer } from '../customers/entities/customer.entity';

@Injectable()
export class AuthService {
  constructor(private readonly customersService: CustomersService) {}

  async register(registrationData: CreateCustomerDto): Promise<Customer> {
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
      const isPasswordMatching = await bcrypt.compare(
        plainTextPassword,
        customer.password,
      );
      if (!isPasswordMatching) {
        throw new BadRequestException('Wrong credentials provided');
      }
      return customer;
    } catch (error) {
      throw new BadRequestException('Wrong credentials provided');
    }
  }
}
