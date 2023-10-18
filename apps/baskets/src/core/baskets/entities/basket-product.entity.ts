import { Field, Float, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Basket } from './basket.entity';

@ObjectType()
@Entity('basket_products', { synchronize: true })
export class BasketProduct {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Float)
  @Column({ type: 'real' })
  productsPrice: number;

  @Field(() => Float)
  @Column({ type: 'real' })
  productsQuantity: number;

  @Field(() => Int)
  @Column({ type: 'integer' })
  productId: number;

  @ManyToOne(() => Basket, (basket: Basket) => basket.basketProducts)
  basket: Basket;
}
