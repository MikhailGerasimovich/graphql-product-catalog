import { Field, Float, InputType, Int } from '@nestjs/graphql';
import { IsDefined, IsNumber, IsOptional, IsString, Length, Min } from 'class-validator';

@InputType()
export class FindProductInput {
  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  @IsDefined()
  @Length(2, 20)
  title?: string;

  @Field(() => Float, { nullable: true })
  @IsNumber()
  @IsOptional()
  @IsDefined()
  @Min(0)
  price?: number;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  @IsDefined()
  @Length(1, 15)
  currency?: string;

  @Field(() => Int, { nullable: true })
  @IsNumber()
  @IsOptional()
  @IsDefined()
  @Min(0)
  quantity?: number;
}
