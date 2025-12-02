import { Module } from '@nestjs/common';
import { SearchService } from './search.service';
import { SearchResolver } from './search.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from 'src/product/entities/product.entity';
import { Vendor } from 'src/vendor/entities/vendor.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Vendor])],
  providers: [SearchResolver, SearchService],
})
export class SearchModule {}
