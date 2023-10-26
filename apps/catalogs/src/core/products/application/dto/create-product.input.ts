import { InputType, Field, Float } from '@nestjs/graphql';
import { IsBoolean, IsIn, IsNotEmpty, IsNumber, IsString, Length, Min } from 'class-validator';

@InputType()
export class CreateProductInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  @Length(2, 20)
  title: string;

  @Field(() => Float)
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  price: number;

  @Field()
  @IsString()
  @IsNotEmpty()
  @IsIn(['USD'])
  @Length(1, 15)
  currency: string;

  @Field(() => Boolean)
  @IsBoolean()
  @IsNotEmpty()
  inStock: boolean;
}
