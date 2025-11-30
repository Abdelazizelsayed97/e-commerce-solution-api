import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleResolver } from './role.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';

@Module({
  providers: [RoleResolver, RoleService],
  exports: [RoleService],
  imports: [TypeOrmModule.forFeature([Role])],
})
export class RoleModule {}
