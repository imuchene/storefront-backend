import { Product } from '../../products/entities/product.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Order } from './order.entity';

@Entity('order_items')
export class OrderItem {
  constructor(intialData: Partial<OrderItem> = null) {
    if (intialData !== null) {
      Object.assign(this, intialData);
    }
  }

  @PrimaryColumn({ name: 'order_id', type: 'uuid' })
  orderId: string;

  @PrimaryColumn({ name: 'product_id', type: 'uuid' })
  productId: string;

  @Column({ name: 'unit_price', type: 'numeric' })
  unitPrice: number;

  @Column({ type: 'numeric' })
  quantity: number;

  @ManyToOne(() => Product, (product) => product.orderItems)
  @JoinColumn({ name: 'product_id', referencedColumnName: 'id' })
  product: Product;

  @ManyToOne(() => Order, (order) => order.orderItems)
  @JoinColumn({ name: 'order_id', referencedColumnName: 'id' })
  order: Order;
}
