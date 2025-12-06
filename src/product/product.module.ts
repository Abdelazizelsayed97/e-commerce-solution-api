import { Module } from '@nestjs/common';
import { ProductService } from './product.service';

import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { StockHistory } from './entities/stock-history.entity';
import { ProductResolver } from './product.resolver';

@Module({
  providers: [ProductResolver, ProductService],
  exports: [ProductService],
  imports: [TypeOrmModule.forFeature([Product, StockHistory])],
})
export class ProductModule {}
