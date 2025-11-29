import { Module } from '@nestjs/common';
import { FcmService } from './fcm.service';
import { FcmResolver } from './fcm.resolver';

@Module({
  providers: [FcmResolver, FcmService],
})
export class FcmModule {}
