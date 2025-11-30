import { registerEnumType } from '@nestjs/graphql';
import { register } from 'module';

export enum VendorPaymentStatus {
  paid = 'paid',
  pending = 'pending',
}
registerEnumType(VendorPaymentStatus, { name: 'VendorPaymentStatus' });
