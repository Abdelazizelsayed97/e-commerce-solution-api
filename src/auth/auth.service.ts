import { Injectable } from '@nestjs/common';
import { LoginInput } from './dto/login-input';
import { RegisterInput } from './dto/register.input';
import { UserService } from 'src/user/user.service';
import { Device } from 'src/core/enums/device.type';
import { S } from 'node_modules/graphql-ws/dist/server-CrZ4ip-g.cjs';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}
  async register(registerInput: RegisterInput) {
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
  async resendOtpCode(email: string) {
    return this.userService.sendVerificationOtp(email);
  }
}
