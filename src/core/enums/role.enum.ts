import { registerEnumType } from '@nestjs/graphql';

export enum Role {
  superAdmin = 'superAdmin',

  client = 'client',

  vendor = 'vendor',
}

registerEnumType(Role, { name: 'role' });
