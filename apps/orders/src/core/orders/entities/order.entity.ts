import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { OrderProduct } from '../../order-products/entities';

@Entity('orders', { synchronize: true })
export class Order extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'integer' })
  userId: number;

  @Column({ type: 'real' })
  totalSpendMoney: number;

  @OneToMany(() => OrderProduct, (orderProducts: OrderProduct) => orderProducts.order)
  orderProducts: OrderProduct[];
}
