import { OrderItem } from 'src/modules/orders/models/order-item';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Product {
  constructor(intialData: Partial<Product> = null) {
    if (intialData !== null) {
      Object.assign(this, intialData);
    }
  }

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ name: 'unit_price', type: 'numeric' })
  unitPrice: number;

  @Column({ name: 'is_discontinued', type: 'boolean' })
  isDiscontinued: boolean;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'varchar' })
  image: string;

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

  @OneToMany(() => OrderItem, (orderItem) => orderItem.product)
  orderItems: OrderItem[];
}
