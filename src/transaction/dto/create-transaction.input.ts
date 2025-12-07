import { Field, InputType } from '@nestjs/graphql';
import { TransactionTypeEnum } from 'src/core/enums/transaction.enum';

@InputType()
export class CreateTransactionInput {
  @Field({
    defaultValue: TransactionTypeEnum.ADJUSTMENT,
  })
  type: TransactionTypeEnum;
  @Field()
  amount: number;
  @Field()
  orderId: string;
  @Field()
  userId: string;
  @Field({ nullable: true })
  description?: string;
}
