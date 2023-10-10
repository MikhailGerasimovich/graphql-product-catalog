import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsString, Min } from 'class-validator';

@InputType()
export class SignUpInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  username: string;

  @Field()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  @Min(4)
  password: string;
}
