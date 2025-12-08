import { InputType, Field, Float } from '@nestjs/graphql';

@InputType()
export class CreateCartItemInput {
  @Field(() => String)
  cartId: string;
  @Field(() => String)
  productId: string;
  @Field(() => Float)
  quantity: number;
  @Field(() => String)
  userId: string;
}
