import { InputType, Field, Int, Float } from '@nestjs/graphql';
import { IsNumber, IsOptional, IsString, Length, Min } from 'class-validator';

@InputType()
export class UpdateProductInput {
  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  @Length(2, 20)
  title?: string;

  @Field(() => Float, { nullable: true })
  @IsNumber()
  @IsOptional()
  @Min(0)
  price?: number;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  @Length(1, 15)
  currency?: string;

  @Field(() => Int, { nullable: true })
  @IsNumber()
  @IsOptional()
  @Min(0)
  quantity?: number;
}
