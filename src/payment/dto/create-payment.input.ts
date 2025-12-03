import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreatePaymentInput {
  @Field(() => String)
  orderId: string;
  @Field(() => Int)
  amount: number;
}