import { Field, InputType } from '@nestjs/graphql';
import {
  IsAlphanumeric,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsPhoneNumber,
  IsStrongPassword,
} from 'class-validator';
import { Device } from 'src/core/enums/device.type';

@InputType()
export class RegisterInput {
  @IsNotEmpty()
  @IsAlphanumeric()
  @Field(() => String)
  name: string;

  @IsNotEmpty()
  @IsEmail()
  @Field(() => String)
  email: string;

  @Field(() => String)
  @IsNotEmpty()
  @IsStrongPassword()
  password: string;

  @Field(() => String)
  @IsNotEmpty()
  @IsPhoneNumber()
  phoneNumber: string;

  @IsNotEmpty()
  @IsEnum(Device)
  @Field(() => Device)
  device: Device;
  
  @IsNotEmpty()
  @Field(() => String)
  token: string;
}
