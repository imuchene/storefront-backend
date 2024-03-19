import { IsEnum, IsNotEmpty, IsNumber, IsUUID } from 'class-validator';
import { OrderItem } from '../entities/order-item.entity';
import { PaymentMethods } from '../../../common/enums/payment-methods.enum';

export class CreateOrderDto {
  @IsUUID()
  @IsNotEmpty()
  id: string;

  @IsNumber()
  @IsNotEmpty()
  totalAmount: number;

  @IsNotEmpty()
  orderItems: OrderItem[];

  @IsEnum(PaymentMethods)
  @IsNotEmpty()
  paymentMethod: string;
}
