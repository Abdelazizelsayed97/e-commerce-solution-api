import { Module } from '@nestjs/common';
import { FcmService } from './fcm.service';
import { FcmResolver } from './fcm.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Fcm } from './entities/fcm.entity';

@Module({
  providers: [FcmResolver, FcmService],
  exports: [FcmService],
  imports: [TypeOrmModule.forFeature([Fcm])],
})
export class FcmModule {}
