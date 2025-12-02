import { createUnionType } from '@nestjs/graphql';
import { Product } from 'src/product/entities/product.entity';
import { Vendor } from 'src/vendor/entities/vendor.entity';

export const SearchResultUnion = createUnionType({
  name: 'SearchResultUnion',
  types: () => [Product, Vendor] as const,
  resolveType(value) {
    if ('shopName' in value) {
      return Vendor;
    }
    if ('name' in value) {
      return Product;
    }
  },
});
