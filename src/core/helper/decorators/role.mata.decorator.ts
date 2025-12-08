import { SetMetadata } from '@nestjs/common';
import { RoleEnum } from 'src/core/enums/role.enum';

export const ROLE_METADATA_KEY = 'roles';

export const  Roles= (
  ...roles: [RoleEnum, ...RoleEnum[]] | [string, ...string[]]
) => SetMetadata(ROLE_METADATA_KEY, roles);
