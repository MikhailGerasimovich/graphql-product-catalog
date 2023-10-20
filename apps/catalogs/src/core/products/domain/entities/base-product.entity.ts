import { Directive, Field, Float, Int, ObjectType } from '@nestjs/graphql';
import { BaseEntity } from 'typeorm';

@ObjectType()
@Directive('@key(fields: "id")')
export class Product extends BaseEntity {
  @Field(() => Int)
  id: number;

  @Field()
  title: string;

  @Field(() => Float)
  price: number;

  @Field()
  currency: string;

  @Field(() => Int)
  quantity: number;
}
