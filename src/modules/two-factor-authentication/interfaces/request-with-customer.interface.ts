import { Request } from 'express';
import { Customer } from '../../../modules/customers/entities/customer.entity';

export interface RequestWithCustomer extends Request {
  customer: Customer;
}
