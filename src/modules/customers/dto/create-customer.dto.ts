import { PartialType } from '@nestjs/mapped-types';
import { IsString } from 'class-validator';
import { Customer } from '../entities/customer.entity';

export class CreateCustomerDto extends PartialType(Customer) {
  @IsString()
  email?: string;

  @IsString()
  name?: string;

  @IsString()
  password?: string;
}
