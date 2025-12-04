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
  balanceAfter: number;
  @Field()
  orderId: string;
  @Field()
  createdAt: Date;
}
