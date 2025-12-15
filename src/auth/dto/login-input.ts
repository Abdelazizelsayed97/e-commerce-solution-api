import { InputType, Int, Field } from '@nestjs/graphql';
import { IsEmail, IsString, IsStrongPassword } from 'class-validator';

@InputType()
export class LoginInput {
  @IsEmail()
  @IsString()
  @Field(() => String)
  email: string;

  @IsStrongPassword()
  @Field(() => String)
  password: string;
}
