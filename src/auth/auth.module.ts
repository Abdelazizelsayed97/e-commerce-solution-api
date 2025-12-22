import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { UserModule } from 'src/user/user.module';

import { AuthController } from './google/auth-google.controller';
import { googleStrategy } from './google/stratgy.google';
import { SerializingUser } from './google/serializing';

@Module({
  providers: [AuthResolver, AuthService, googleStrategy, SerializingUser],
  exports: [AuthService],
  imports: [UserModule],
  controllers: [AuthController],
})
export class AuthModule {}
