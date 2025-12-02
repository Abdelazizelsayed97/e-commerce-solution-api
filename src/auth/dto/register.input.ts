import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';
import { RoleEnum } from 'src/core/enums/role.enum';

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

  @IsNotEmpty()
  @Field(() => RoleEnum)
  role: RoleEnum;
}
