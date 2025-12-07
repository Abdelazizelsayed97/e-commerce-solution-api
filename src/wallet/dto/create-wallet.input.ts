import { InputType, Int, Field, Float } from '@nestjs/graphql';

@InputType()
export class CreateWalletInput {
  @Field(() => Float)
  balance: number;
  @Field(() => Float)
  pendingBalance: number;
  @Field(() => String)
  currency: string;
  @Field(() => String)
  type: string;

  @Field(() => [String])
  transactionHistory: string[];
  @Field(() => String)
  userId: string;
}
