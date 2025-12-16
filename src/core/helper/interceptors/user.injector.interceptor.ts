import { Injectable, NestMiddleware, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';

@Injectable()
export class UserInjectorInterceptor implements NestMiddleware {
  constructor(
    private readonly authService: JwtService,
    private readonly usersService: UserService,
  ) {}

  async use(req: any, res: any, next: () => void) {
    const token = req.headers.authorization?.split(' ')[1];

    if (token) {
      try {
        const payload = await this.authService.verifyAsync(token);
        const user = await this.usersService.findOneById(
          payload.sub ?? payload.id,
        );
        if (user) {
          req.user = user;
        } else {
          throw new NotFoundException('User not found');
        }
      } catch (e) {
        console.log(
          'UserInspectorMiddleware: Failed to attach user:',
          e?.message ?? e,
        );
      }
    }
    next();
  }
}
