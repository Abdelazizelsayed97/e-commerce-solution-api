import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryResolver } from './category.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';

@Module({
  providers: [CategoryResolver, CategoryService],
  exports: [CategoryService],
  imports: [TypeOrmModule.forFeature([Category])],
})
export class CategoryModule {}
