import { CreateCartItemInput } from './create-cart_item.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateCartItemInput extends PartialType(CreateCartItemInput) {
  @Field(() => Int)
  id: number;
}
