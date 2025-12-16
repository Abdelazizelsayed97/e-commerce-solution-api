import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { CreateVendorInput } from './create-vendor.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateVendorInput extends PartialType(CreateVendorInput) {
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  @Field(() => String)
  id: string;
}
