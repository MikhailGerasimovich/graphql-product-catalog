import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateBasketInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
