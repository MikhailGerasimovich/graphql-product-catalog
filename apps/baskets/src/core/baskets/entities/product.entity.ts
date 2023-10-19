import { Directive, Field, Int, ObjectType } from '@nestjs/graphql';
import { Exclude } from 'class-transformer';

import { BasketProduct } from './basket-product.entity';

@ObjectType()
@Directive('@extends')
@Directive('@key(fields: "id")')
export class Product {
  @Field(() => Int)
  @Directive('@external')
  id: number;

  @Field(() => BasketProduct)
  // @Exclude()
  basketProduct: BasketProduct;
}
