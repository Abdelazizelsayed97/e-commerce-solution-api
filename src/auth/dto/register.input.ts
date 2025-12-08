import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';
import { Device } from 'src/core/enums/device.type';


@InputType()
export class RegisterInput {
  @IsNotEmpty()
  @Field(() => String)
  name: string;

  @IsNotEmpty()
  @Field(() => String)
  email: string;

  @Field(() => String)
  @IsNotEmpty()
  password: string;

  @Field(() => String)
  @IsNotEmpty()
  phoneNumber: string;


  @Field(() => Device)
  device: Device;
  @Field(() => String)
  token: string;
}
