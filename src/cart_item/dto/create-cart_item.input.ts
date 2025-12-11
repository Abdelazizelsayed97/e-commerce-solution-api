import { InputType, Field, Float } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class CreateCartItemInput {
  @IsNotEmpty()
  @Field(() => String)
  cartId: string;
  @IsNotEmpty()
  @Field(() => String)
  productId: string;
  @IsNotEmpty()
  @Field(() => Float)
  quantity: number;
  @IsNotEmpty()
  @Field(() => String)
  userId: string;
}
