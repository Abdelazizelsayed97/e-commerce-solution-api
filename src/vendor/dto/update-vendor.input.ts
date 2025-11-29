import { CreateVendorInput } from './create-vendor.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateVendorInput extends PartialType(CreateVendorInput) {
  @Field(() => Int)
  id: number;
}
