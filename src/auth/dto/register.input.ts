import { Field, InputType } from '@nestjs/graphql';
import { CreateAddressInput } from 'src/address/dto/create-address.input';
import { Address } from 'src/address/entities/address.entity';
import { RoleEnum } from 'src/core/enums/role.enum';

@InputType()
export class RegisterInput {
  @Field(() => String)
  name: string;
  @Field(() => String)
  email: string;
  @Field(() => String)
  password: string;
  @Field(() => String)
  phone: string;
  @Field(() => [CreateAddressInput])
  address: CreateAddressInput[];
  @Field(() => RoleEnum)
  role: RoleEnum;
}
