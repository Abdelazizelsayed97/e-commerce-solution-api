import { Resolver, Query, Args, ResolveField, Parent } from '@nestjs/graphql';
import { SearchService } from './search.service';
import { PaginatedSearch } from './entities/search.entity';
import { SearchInput } from './dto/search.input';
import DataLoader from 'dataloader';
import { Product } from 'src/product/entities/product.entity';
import { Vendor } from 'src/vendor/entities/vendor.entity';
import { DataSource } from 'typeorm';
import { productLoader } from 'src/product/loader/product.loader';
import { VendorUserLoader } from 'src/vendor/loaders/vendor.loader';


@Resolver(() => PaginatedSearch)
export class SearchResolver {
  productLoader: DataLoader<string, Product>;
  vendorLoader: DataLoader<string, Vendor | null>;
  constructor(
    private readonly searchService: SearchService,
    private dataSource: DataSource,
  ) {
    this.productLoader = productLoader(dataSource);
    this.vendorLoader = VendorUserLoader(dataSource) as DataLoader<
      string,
      Vendor | null
    >;
  }

  @Query(() => PaginatedSearch, { name: 'search' })
  search(@Args('searchInput') searchInput: SearchInput) {
    return this.searchService.search(searchInput);
  }
  // @ResolveField(() => [Product])
  // product(@Parent() parent: PaginatedSearch) {
  //   this.productLoader.loadMany([]);
  // }

  // @ResolveField(() => [Vendor])
  // vendor(@Args('key') key: string) {
  //   this.vendorLoader.loadMany([key]);
  // }
}
