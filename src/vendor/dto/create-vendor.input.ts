import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateVendorInput {
  @Field(() => String)
  user_id: string;
  @Field(() => String)
  shopName: string;
  @Field(() => Int)
  balance?: number;
  @Field(() => Int)
  rating: number;
  @Field(() => Boolean)
  isVerfied: boolean;
}
