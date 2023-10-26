import { InputType, Field, Int, Float } from '@nestjs/graphql';
import { IsBoolean, IsIn, IsNumber, IsOptional, IsString, Length, Min } from 'class-validator';

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
  @IsIn(['USD'])
  @Length(1, 15)
  currency?: string;

  @Field(() => Boolean, { nullable: true })
  @IsBoolean()
  @IsOptional()
  inStock: boolean;
}
