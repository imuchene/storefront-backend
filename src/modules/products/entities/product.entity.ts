import { OrderItem } from '../../orders/entities/order-item.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn,
} from 'typeorm';

@Entity('products')
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

  @Column({ type: 'text' })
  description: string;

  @Column({ name: 'image_url', type: 'varchar' })
  imageUrl: string;

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

  @DeleteDateColumn({
    name: 'deleted_at',
    type: 'timestamptz',
  })
  deletedAt: string;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.product)
  orderItems: Relation<OrderItem[]>;
}
