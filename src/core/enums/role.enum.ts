import { registerEnumType } from '@nestjs/graphql';

export const role_key = 'roles';

export enum RoleEnum {
  superAdmin = 'superAdmin',
  client = 'client',
  vendor = 'vendor',
}

registerEnumType(RoleEnum, { name: 'role' });
