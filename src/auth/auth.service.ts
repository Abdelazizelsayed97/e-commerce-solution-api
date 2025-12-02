import { Injectable } from '@nestjs/common';
import { LoginInput } from './dto/login-input';
import { RegisterInput } from './dto/register.input';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async login(loginInput: LoginInput) {
    return await this.userService.verifyUser(loginInput);
  }

  async register(registerInput: RegisterInput) {
    console.log('registerInput', registerInput);
    return await this.userService.create(registerInput);
  }
}
