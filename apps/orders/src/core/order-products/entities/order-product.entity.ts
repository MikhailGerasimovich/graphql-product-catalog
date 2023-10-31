import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Order } from '../../orders/entities';

@Entity('order_products')
export class OrderProduct extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'integer' })
  productId: number;

  @Column({ type: 'integer' })
  productQuantity: number;

  @Column({ type: 'varchar' })
  purchaseDate: string;

  @ManyToOne(() => Order, (order: Order) => order.orderProducts)
  order: Order;
}
