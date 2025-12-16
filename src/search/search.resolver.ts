import { Resolver, Query, Args, ResolveField, Parent } from '@nestjs/graphql';
import { SearchService } from './search.service';
import { PaginatedSearch } from './entities/search.entity';
import { SearchInput } from './dto/search.input';
import DataLoader from 'dataloader';
import { Product } from 'src/product/entities/product.entity';
import { Vendor } from 'src/vendor/entities/vendor.entity';
import { DataSource } from 'typeorm';
import { productLoader } from 'src/product/loader/product.loader';
import { VendorLoader } from 'src/vendor/loaders/vendor.loader';
import { SearchResultUnion } from './entities/search-result.union';

@Resolver(() => PaginatedSearch)
export class SearchResolver {
  productLoader: DataLoader<string, Product>;
  vendorLoader: DataLoader<string, Vendor | null>;
  constructor(
    private readonly searchService: SearchService,
    private dataSource: DataSource,
  ) {
    this.productLoader = productLoader(dataSource);
    this.vendorLoader = VendorLoader(dataSource.getRepository(Vendor));
  }

  @Query(() => PaginatedSearch, { name: 'search' })
  search(@Args('searchInput') searchInput: SearchInput) {
    console.log('---==---', searchInput);
    return this.searchService.search(searchInput);
  }
  // @ResolveField(() => Product, { nullable: true })
  // async product(@Parent() search: typeof SearchResultUnion) {
  //   if (!search.product_id) return null;
  //   return this.productLoader.load(search.product_id);
  // }
  // @ResolveField(() => Vendor, { nullable: true })
  // async vendor(@Parent() search: typeof SearchResultUnion) {
  //   if (!search.vendor_id) return null;
  //   return this.vendorLoader.load(search.vendor_id);
  // }
}
