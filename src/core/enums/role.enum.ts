import { registerEnumType } from '@nestjs/graphql';

export enum RoleEnum {
  superAdmin = 'superAdmin',
  client = 'client',
  vendor = 'vendor',
}

registerEnumType(RoleEnum, { name: 'role' });
