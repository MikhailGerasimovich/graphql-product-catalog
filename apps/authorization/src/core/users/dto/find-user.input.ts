import { Field, InputType } from '@nestjs/graphql';
import { IsDefined, IsEmail, IsOptional, IsString } from 'class-validator';

@InputType()
export class FindUserInput {
  @Field()
  @IsString()
  @IsOptional()
  @IsDefined()
  uesrname?: string;

  @Field()
  @IsEmail()
  @IsOptional()
  @IsDefined()
  email?: string;
}
