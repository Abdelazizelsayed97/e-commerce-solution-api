import { JwtService } from '@nestjs/jwt';

import { Injectable, NestMiddleware } from '@nestjs/common';
import { UserService } from 'src/user/user.service';

@Injectable()
export class UserInspectorMiddleware implements NestMiddleware {
  constructor(
    private readonly authService: JwtService,
    private readonly usersService: UserService,
  ) {}

  async use(req: any, res: any, next: () => void) {
    const token = req.headers.authorization?.split(' ')[1];

    if (token) {
      try {
        const payload = await this.authService.verifyAsync(token);
        const user = await this.usersService.findOne(payload.sub ?? payload.id);
        if (user) {
          req.user = user;
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
