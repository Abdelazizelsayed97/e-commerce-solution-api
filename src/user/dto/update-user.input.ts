import { InputType, Field, Int, PartialType } from '@nestjs/graphql';
import {
  IsEmail,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  IsStrongPassword,
  IsUUID,
} from 'class-validator';

@InputType()
export class UpdateUserInput {
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  @Field(() => String)
  id: string;

  @IsNotEmpty()
  @IsString()
  @Field(() => String)
  name: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @Field(() => String)
  email: string;

  @IsNotEmpty()
  @IsString()
  @IsStrongPassword()
  @Field(() => String)
  password: string;
  @IsNotEmpty()
  @IsString()
  @IsPhoneNumber('EG')
  @Field(() => String)
  phoneNumber: string;
}
