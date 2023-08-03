import { Order } from '../../orders/entities/order.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn,
} from 'typeorm';

@Entity('order_payments')
export class OrderPayment {
  constructor(intialData: Partial<OrderPayment> = null) {
    if (intialData !== null) {
      Object.assign(this, intialData);
    }
  }

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'provider_reference', type: 'varchar', unique: true })
  providerReference: string;

  @Column({ name: 'payment_status', type: 'varchar' })
  paymentStatus: string;

  @Column({ type: 'text' })
  reason: string;

  @Column({ name: 'transaction_code', type: 'varchar', unique: true })
  transactionCode: string;

  @Column({ name: 'order_id', type: 'uuid' })
  orderId: string;

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

  @OneToOne(() => Order, (order) => order.orderPayment)
  @JoinColumn({ name: 'order_id', referencedColumnName: 'id' })
  order: Relation<Order>;
}
