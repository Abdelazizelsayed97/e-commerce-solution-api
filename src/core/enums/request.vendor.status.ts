import { registerEnumType } from '@nestjs/graphql';

export enum RequestVendorEnum {
  aprovel = 'aprovel',
  reject = 'reject',
  pending = 'pending',
}
registerEnumType(RequestVendorEnum, { name: 'RequestVendorEnum' });
