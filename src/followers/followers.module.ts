import { Module } from '@nestjs/common';
import { FollowersService } from './followers.service';
import { FollowersResolver } from './followers.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Follower } from './entities/follower.entity';
import { UserModule } from 'src/user/user.module';
import { VendorModule } from 'src/vendor/vendor.module';
import { FollowerLoader } from './loaders/follower.loader';

@Module({
  providers: [FollowersResolver, FollowersService, FollowerLoader],
  exports: [FollowersService],
  imports: [TypeOrmModule.forFeature([Follower]), UserModule, VendorModule],
})
export class FollowersModule {}
