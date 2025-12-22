import { Resolver, Query, Args, ResolveField, Parent } from '@nestjs/graphql';
import { SearchService } from './search.service';
import { PaginatedSearch } from './entities/search.entity';
import { SearchInput } from './dto/search.input';
import DataLoader from 'dataloader';
import { Product } from 'src/product/entities/product.entity';
import { Vendor } from 'src/vendor/entities/vendor.entity';
import { ProductLoader } from 'src/product/loader/product.loader';
import { VendorLoader } from 'src/vendor/loaders/vendor.loader';
import { SearchResultUnion } from './entities/search-result.union';

@Resolver(() => PaginatedSearch)
export class SearchResolver {
  constructor(
    private readonly searchService: SearchService,
    private readonly productLoader: ProductLoader,
    private readonly vendorLoader: VendorLoader,
  ) {}

  @Query(() => PaginatedSearch, { name: 'search' })
  search(@Args('searchInput') searchInput: SearchInput) {
    console.log('---==---', searchInput);
    return this.searchService.search(searchInput);
  }
  // @ResolveField(() => Product, { nullable: true })
  // async product(@Parent() search: typeof SearchResultUnion) {
  //   if (!search.product_id) return null;
  //   return this.productLoader.loader().load(search.product_id);
  // }
  // @ResolveField(() => Vendor, { nullable: true })
  // async vendor(@Parent() search: typeof SearchResultUnion) {
  //   if (!search.vendor_id) return null;
  //   return this.vendorLoader.load(search.vendor_id);
  // }
}
