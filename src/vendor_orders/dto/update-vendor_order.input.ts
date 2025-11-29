import { CreateVendorOrderInput } from './create-vendor_order.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateVendorOrderInput extends PartialType(CreateVendorOrderInput) {
  @Field(() => Int)
  id: number;
}
