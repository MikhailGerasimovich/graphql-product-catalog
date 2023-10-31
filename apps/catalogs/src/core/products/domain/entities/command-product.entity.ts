import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from './base-product.entity';

@Entity('products')
export class CommandProduct extends Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text', nullable: false })
  title: string;

  @Column({ type: 'real' })
  price: number;

  @Column({ type: 'text' })
  currency: string;

  @Column({ type: 'boolean' })
  inStock: boolean;
}
