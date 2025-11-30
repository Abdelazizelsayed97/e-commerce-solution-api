import { InputType, Int, Field } from '@nestjs/graphql';
import { IsAlphanumeric, IsNotEmpty } from 'class-validator';

@InputType()
export class CreateRoleInput {
  @IsNotEmpty()
  @IsAlphanumeric()
  @Field(() => String)
  name: string;
  @Field(() => [String])
  permissions: string[];
}
