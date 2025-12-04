import { registerEnumType } from '@nestjs/graphql';

export enum TransactionTypeEnum {
  ORDER_INCOME = 'ORDER_INCOME',
  MARKETPLACE_COMMISSION = 'MARKETPLACE_COMMISSION',
  PAYOUT = 'PAYOUT',
  REFUND = 'REFUND',
  ADJUSTMENT = 'ADJUSTMENT',
}
registerEnumType(TransactionTypeEnum, { name: 'transactionType' });
