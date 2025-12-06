import { registerEnumType } from "@nestjs/graphql";

export enum OrderPaymentVendorStatusEnum {
  PAYMENT_FAILED = 'payment_failed',
  PAYMENT_PENDING = 'payment_pending',
  PAYMENT_COMPLETED = 'payment_completed',
  PAYMENT_PROCESSING_FAILED= 'payment_processing_failed',
}
registerEnumType(OrderPaymentVendorStatusEnum, { name: 'OrderPaymentVendorStatusEnum' });