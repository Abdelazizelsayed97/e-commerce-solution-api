import { registerEnumType } from '@nestjs/graphql';

export enum Device {
  iOS = 'IOS',
  Android = 'Android',
  Web = 'Web',
}
registerEnumType(Device, { name: 'Device' });
