import { Field, InputType } from '@nestjs/graphql';
import { IsDefined, IsEmail, IsOptional, IsString } from 'class-validator';

@InputType()
export class FindUserInput {
  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  @IsDefined()
  uesrname?: string;

  @Field({ nullable: true })
  @IsEmail()
  @IsOptional()
  @IsDefined()
  email?: string;
}
