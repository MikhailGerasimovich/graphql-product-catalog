import { ObjectType, Field, Int, Float, Directive } from '@nestjs/graphql';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { BasketProduct } from './basket-product.entity';
import { User } from './user.entity';

@ObjectType()
@Directive('@key(fields: "id")')
@Entity('baskets', { synchronize: true })
export class Basket {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Int)
  @Column({ type: 'integer' })
  userId: number;

  @Field(() => Float)
  @Column({ type: 'real' })
  totalPrice: number;

  @Field(() => [BasketProduct])
  @OneToMany(() => BasketProduct, (basketProduct: BasketProduct) => basketProduct.basket)
  basketProducts: BasketProduct[];

  @Field(() => User)
  user?: User;
}
