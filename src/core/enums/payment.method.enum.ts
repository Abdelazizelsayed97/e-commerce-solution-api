import { registerEnumType } from '@nestjs/graphql';

export enum paymentMethod {
  card = 'card',
  wallet = 'wallet',
  cash = 'cash',
}
registerEnumType(paymentMethod, { name: 'paymentMethod' });
