import { Field, Int, ObjectType } from '@nestjs/graphql';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

@ObjectType()
export class Payload {
  @Field(() => Int)
  @IsInt()
  @IsNotEmpty()
  sub: number;

  @Field()
  @IsString()
  @IsNotEmpty()
  role: string;
}
