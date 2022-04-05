import { Exclude } from 'class-transformer';
import { Order } from '../../orders/models/order';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('customers')
export class Customer {
  constructor(intialData: Partial<Customer> = null) {
    if (intialData !== null) {
      Object.assign(this, intialData);
    }
  }

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar' })
  email: string;

  @Column({ name: 'phone_number', type: 'varchar' })
  phoneNumber: string;

  @Exclude()
  @Column({ name: 'password_digest', type: 'varchar' })
  password: string;

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

  @OneToMany(() => Order, (order) => order.customer)
  orders: Order[];
}
