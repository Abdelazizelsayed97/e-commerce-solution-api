import { InputType, Int, Field, GraphQLTimestamp } from '@nestjs/graphql';
import { CreateCartItemInput } from 'src/cart_item/dto/create-cart_item.input';

@InputType()
export class CreateCartInput {
  @Field(() => String)
  userId: string;

}
