import { InputType, Int, Field } from '@nestjs/graphql';
import { IsBoolean, IsNotEmpty, IsNumber, IsString, IsUUID } from 'class-validator';

@InputType()
export class CreateVendorInput {
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  @Field(() => String)
  user_id: string;

  @IsNotEmpty()
  @IsString()
  @Field(() => String)
  shopName: string;
}
