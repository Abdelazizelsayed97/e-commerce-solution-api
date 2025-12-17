import { Injectable } from '@nestjs/common';
import { LoginInput } from './dto/login-input';
import { RegisterInput } from './dto/register.input';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}
  async register(registerInput: RegisterInput) {
    console.log('testing the register', registerInput);

    return await this.userService.create(registerInput);
  }

  async login(loginInput: LoginInput) {
    return await this.userService.verifyUser(loginInput);
  }

  async verfiyUser(userId: string, code: string) {
    return await this.userService.verifyUserEmail(userId, code);
  }
  async forgetPassword(email: string) {
    return await this.userService.forgetPassword(email);
  }
}
