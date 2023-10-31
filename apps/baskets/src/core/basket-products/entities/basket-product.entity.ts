import { Directive, Field, Float, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Basket } from '../../baskets/entities';
import { Product } from './product.entity';

@ObjectType()
@Directive('@key(fields: "id")')
@Entity('basket_products')
export class BasketProduct {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Float)
  @Column({ type: 'real' })
  productsPrice: number;

  @Field(() => Float)
  @Column({ type: 'integer' })
  productQuantity: number;

  @Field(() => Int)
  @Column({ type: 'integer' })
  productId: number;

  @Column({ type: 'text' })
  productTitle: string;

  @ManyToOne(() => Basket, (basket: Basket) => basket.basketProducts)
  basket: Basket;

  @Field(() => Product)
  product?: Product;
}
