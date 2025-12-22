import { Inject } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { AuthService } from '../auth.service';

export class SerializingUser extends PassportSerializer {
  constructor(
    @Inject(AuthService) private readonly authService: AuthService
  ) {
    super();
  }
  serializeUser(user: any, done: Function) {
    done(null, user.id);
  }
  deserializeUser(payload: any, done: Function) {
    return this.authService
      .findUser(payload.id)
      .then((user) => done(null, user))
      .catch((error) => done(error));
  }
}
