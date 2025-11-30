import { registerEnumType } from '@nestjs/graphql';

export enum Shipping_Status {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  DELIVERED = 'DELIVERED',
  CANCEL = 'CANCEL',
}
registerEnumType(Shipping_Status, { name: 'Shipping_Status' });
