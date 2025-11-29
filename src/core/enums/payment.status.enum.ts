import { registerEnumType } from '@nestjs/graphql';

export enum OrderPaymentStatus {
  paid = 'paid',
  pending = 'pending',
  refunded = 'refunded',
}
registerEnumType(OrderPaymentStatus, { name: 'OrderPaymentStatus' });
