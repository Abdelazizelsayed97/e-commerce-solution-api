import { Module } from '@nestjs/common';
import { FcmService } from './fcm.service';
import { FcmResolver } from './fcm.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Fcm } from './entities/fcm.entity';
import { FcmLoader } from './loaders/fcm.loader';

@Module({
  providers: [FcmResolver, FcmService, FcmLoader],
  exports: [FcmService],
  imports: [TypeOrmModule.forFeature([Fcm])],
})
export class FcmModule {}
