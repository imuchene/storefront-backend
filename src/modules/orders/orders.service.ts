import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Customer } from '../customers/entities/customer.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Repository } from 'typeorm';
import { ProductsService } from '../products/products.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly ordersRepository: Repository<Order>,
    private readonly productsService: ProductsService,
  ) {}

  async create(createOrderDto: CreateOrderDto, customer: Customer) {
    // Check if the products in the order exist
    const productIds = createOrderDto.orderItems.map((item) => item.productId);
    const products = await this.productsService.checkIfProductsExist(
      productIds,
    );

    // If none of the products in the order exist, or only some exist, while others
    // do not, throw an exception
    if (!products || products.length != productIds.length) {
      throw new UnprocessableEntityException(
        'The order could not be processed',
      );
    }

    const order = new Order({
      customerId: customer.id,
      totalAmount: createOrderDto.totalAmount,
    });

    order.orderItems = createOrderDto.orderItems;

    return await this.ordersRepository.save(order);
  }
}
