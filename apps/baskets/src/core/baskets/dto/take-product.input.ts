import { InputType, Int, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber, IsOptional, Min } from 'class-validator';

@InputType()
export class TakeProductInput {
  @Field(() => Int)
  @IsNumber()
  @IsNotEmpty()
  productId: number;

  @Field(() => Int, { nullable: true })
  @IsNumber()
  @IsOptional()
  @Min(1)
  productQuantity?: number = 1;
}
