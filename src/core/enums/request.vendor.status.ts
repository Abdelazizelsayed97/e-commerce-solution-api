import { registerEnumType } from '@nestjs/graphql';

export enum RequestVendorEnum {
  approve = 'approve',
  reject = 'reject',
  pending = 'pending',
}
registerEnumType(RequestVendorEnum, { name: 'RequestVendorEnum' });
