import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { Customer } from './entities/customer.entity';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private readonly customersRepository: Repository<Customer>,
  ) {}

  async getByEmail(email: string): Promise<Customer> {
    const customer = await this.customersRepository.findOne({
      where: { email },
    });

    if (customer) {
      return customer;
    }

    throw new NotFoundException('Customer with this email does not exist');
  }

  async getById(id: string): Promise<Customer> {
    const customer = await this.customersRepository.findOne({ where: { id } });

    if (customer) {
      return customer;
    }

    throw new NotFoundException('Customer with this id does not exist');
  }

  async create(customerData: CreateCustomerDto): Promise<Customer> {
    return new Customer(await this.customersRepository.save(customerData));
  }
}
