import { CreateCartItemInput } from './create-cart_item.input';
import { InputType, Field, PartialType, Float } from '@nestjs/graphql';

@InputType()
export class UpdateCartItemInput extends PartialType(CreateCartItemInput) {
  @Field(() => String)
  id: string;

  @Field(() => Float, { nullable: true })
  quantity?: number;
}
