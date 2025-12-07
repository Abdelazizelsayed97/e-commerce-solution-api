import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Reflector } from '@nestjs/core';
import { role_key } from 'src/core/enums/role.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const gqlCtx = GqlExecutionContext.create(context);
    const request = gqlCtx.getContext().req;
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(role_key, [
      gqlCtx.getHandler(),
      gqlCtx.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const user = JSON.stringify(request.user);

    const hasRole = () => requiredRoles.includes(user['role']);
    if (user && hasRole()) {
      return true;
    }
    return true;
  }
}
