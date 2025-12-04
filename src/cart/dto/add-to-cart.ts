import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class addToCartInput {
  @Field(() => String)
  cartId: string;
  @Field(() => String)
  cartItemId: string;
}
