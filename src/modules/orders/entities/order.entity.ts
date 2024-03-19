import { Customer } from '../../customers/entities/customer.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryColumn,
  Relation,
  UpdateDateColumn,
} from 'typeorm';
import { OrderItem } from './order-item.entity';
import { PaymentStatus } from '../../../common/enums/payment-status.enum';
import { OrderPayment } from '../../payments/entities/order-payment.entity';
import { PaymentRequest } from '../../payments/entities/payment-request.entity';

@Entity('orders')
export class Order {
  constructor(intialData: Partial<Order> = null) {
    if (intialData !== null) {
      Object.assign(this, intialData);
    }
  }

  @PrimaryColumn('uuid')
  id: string;

  @Column({ name: 'customer_id', type: 'uuid' })
  customerId: string;

  @Column({ name: 'total_amount', type: 'numeric' })
  totalAmount: number;

  @Column({
    name: 'payment_status',
    type: 'varchar',
    default: PaymentStatus.Created,
  })
  paymentStatus: PaymentStatus;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamptz',
    default: 'now()',
    readonly: true,
  })
  createdAt: string;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamptz',
    default: 'now()',
  })
  updatedAt: string;

  @ManyToOne(() => Customer, (customer) => customer.orders)
  @JoinColumn({ name: 'customer_id', referencedColumnName: 'id' })
  customer: Relation<Customer>;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order, { cascade: true })
  orderItems: Relation<OrderItem[]>;

  @OneToOne(() => OrderPayment, (orderPayment) => orderPayment.order)
  orderPayment: Relation<OrderPayment>;

  @OneToOne(() => PaymentRequest, (paymentRequest) => paymentRequest.order)
  paymentRequest: Relation<PaymentRequest>;
}
