import { CreateBasketInput } from './create-basket.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateBasketInput extends PartialType(CreateBasketInput) {
  @Field(() => Int)
  id: number;
}
