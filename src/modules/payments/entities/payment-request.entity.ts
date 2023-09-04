import { Order } from '../../orders/entities/order.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn,
} from 'typeorm';

@Entity('payment_requests')
export class PaymentRequest extends BaseEntity {
  constructor(intialData: Partial<PaymentRequest> = null) {
    super();
    if (intialData !== null) {
      Object.assign(this, intialData);
    }
  }

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'provider_reference', type: 'varchar', unique: true })
  providerReference: string;

  @Column({
    name: 'secondary_provider_reference',
    type: 'varchar',
    unique: true,
    nullable: true,
  })
  secondaryProviderReference: string;

  @Column({ type: 'varchar' })
  provider: string;

  @Column({ name: 'payment_method', type: 'varchar' })
  paymentMethod: string;

  @Column({ type: 'varchar' })
  status: string;

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

  @OneToOne(() => Order, (order) => order.paymentRequest)
  @JoinColumn({ name: 'order_id', referencedColumnName: 'id' })
  order: Relation<Order>;
}
