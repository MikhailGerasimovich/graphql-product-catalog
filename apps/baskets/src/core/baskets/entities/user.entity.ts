import { Directive, Field, Int, ObjectType } from '@nestjs/graphql';
import { Basket } from './basket.entity';

@ObjectType()
@Directive('@extends')
@Directive('@key(fields: "id")')
export class User {
  @Field(() => Int)
  @Directive('@external')
  id: number;

  @Field(() => Basket, { nullable: true })
  basket?: Basket;
}
