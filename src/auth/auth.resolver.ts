import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { AuthService } from './auth.service';

import { LoginInput } from './dto/login-input';
import { User } from 'src/user/entities/user.entity';
import { RegisterInput } from './dto/register.input';
import { Throttle } from '@nestjs/throttler';

@Resolver(() => User)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Throttle({
    login: {
      ttl: 60,
      limit: 5,
    },
  })
  @Mutation(() => User)
  login(@Args('loginInput') loginInput: LoginInput) {
    return this.authService.login(loginInput);
  }

  @Throttle({
    login: {
      ttl: 60,
      limit: 5,
    },
  })
  @Mutation(() => User, { name: 'register' })
  register(
    @Args('registerInput', { type: () => RegisterInput })
    registerInput: RegisterInput,
  ) {
    console.log('testing the register', registerInput);

    return this.authService.register(registerInput);
  }
  @Mutation(() => User)
  verfiyUser(@Args('userId') userId: string, @Args('code') code: string) {
    return this.authService.verfiyUser(userId, code);
  }
  @Mutation(() => User)
  forgetPassword(@Args('email') email: string) {
    return this.authService.forgetPassword(email);
  }
}
