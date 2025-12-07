import { JwtService } from '@nestjs/jwt';
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { UserService } from 'src/user/user.service';
import { Observable } from 'rxjs';

@Injectable()
export class UserInspectorInterceptor implements NestInterceptor {
  constructor(
    private readonly authService: JwtService,
    private readonly usersService: UserService,
  ) {}

  async intercept(context: ExecutionContext, next: CallHandler) {
    const gqlContext = GqlExecutionContext.create(context);
    const request = gqlContext.getContext().req;
    const token = request.headers.authorization?.split(' ')[1];

    if (token) {
      try {
        const payload = await this.authService.verifyAsync(token);

        const user = await this.usersService.findOne(payload.sub ?? payload.id);

        if (user) {
          request.user = user;
        }
        console.log(
          'UserInspectorInterceptor: User attached to request:',
          request.user,
        );
      } catch (e) {
        console.log(
          'UserInspectorInterceptor: Failed to attach user:',
          e?.message ?? e,
        );
      }
    }

    return next.handle();
  }
}
