import { InputType, Int, Field, Float } from '@nestjs/graphql';

@InputType()
export class CreateCartItemInput {
  @Field(() => String)
  cartId: string;
  @Field(() => String)
  productId: string;
  @Field(() => String)
  vendorId: string;

  @Field(() => Float)
  quantity: number;

  @Field(() => Float)
  totlePrice: number;
  @Field(() => String)
  userId: string;
}
