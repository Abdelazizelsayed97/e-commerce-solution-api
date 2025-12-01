import { InputType, Field } from '@nestjs/graphql';
import { IsAlphanumeric, IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class CreateRequestVendorInput {
  @IsAlphanumeric()
  @IsNotEmpty()
  @Field(() => String)
  shopName: string;
  @IsNotEmpty()
  @IsString()
  @Field(() => String)
  user_id: string;
}
