import { InputType, Field, PartialType } from '@nestjs/graphql';
import { IsAlphanumeric, IsNotEmpty, IsString } from 'class-validator';
import { CreateVendorInput } from 'src/vendor/dto/create-vendor.input';

@InputType()
export class CreateRequestVendorInput extends PartialType(CreateVendorInput) {
  @IsAlphanumeric()
  @IsNotEmpty()
  @Field(() => String)
  shopName: string;
  @IsNotEmpty()
  @IsString()
  @Field(() => String)
  user_id: string;
}
