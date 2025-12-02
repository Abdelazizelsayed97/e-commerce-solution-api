import { Resolver, Query, Args } from '@nestjs/graphql';
import { SearchService } from './search.service';
import { PaginatedSearch } from './entities/search.entity';
import { SearchInput } from './dto/search.input';

@Resolver(() => PaginatedSearch)
export class SearchResolver {
  constructor(private readonly searchService: SearchService) {}

  @Query(() => PaginatedSearch, { name: 'search' })
  search(@Args('searchInput') searchInput: SearchInput) {
    return this.searchService.search(searchInput);
  }
}
