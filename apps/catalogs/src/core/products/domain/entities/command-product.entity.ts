import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from './base-product.entity';

@Entity('products')
export class CommandProduct extends Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: false })
  title: string;

  @Column({ type: 'real' })
  price: number;

  @Column({ type: 'varchar' })
  currency: string;

  @Column({ type: 'boolean' })
  inStock: boolean;
}
