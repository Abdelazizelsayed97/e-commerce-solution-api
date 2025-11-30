import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { UserModule } from 'src/user/user.module';

@Module({
  providers: [AuthResolver, AuthService],
  exports: [AuthService],
  imports: [UserModule],
})
export class AuthModule {}
