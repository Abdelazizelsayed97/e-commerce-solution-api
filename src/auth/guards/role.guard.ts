import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Reflector } from '@nestjs/core';
import { role_key } from 'src/core/enums/role.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const gqlCtx = GqlExecutionContext.create(context);
    const request = gqlCtx.getContext().req;

    const requiredRoles = this.reflector.getAllAndOverride<string[]>(role_key, [
      gqlCtx.getHandler(),
      gqlCtx.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const user = request.user;

    if (!user || !user.role) {
      return false;
    }

    return requiredRoles.includes(user.role);
  }
}
