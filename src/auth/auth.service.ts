import { Injectable } from '@nestjs/common';
import { LoginInput } from './dto/login-input';
import { RegisterInput } from './dto/register.input';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async login(loginInput: LoginInput) {
    return this.userService.findOne(loginInput.email);
  }

  register(registerInput: RegisterInput) {
    return this.userService.create(registerInput);
  }
}
