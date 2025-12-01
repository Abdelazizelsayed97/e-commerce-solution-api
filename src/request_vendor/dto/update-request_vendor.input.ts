import { CreateRequestVendorInput } from './create-request_vendor.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateRequestVendorInput extends PartialType(CreateRequestVendorInput) {
  @Field(() => Int)
  id: number;
}
