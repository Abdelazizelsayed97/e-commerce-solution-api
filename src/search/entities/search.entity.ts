import { ObjectType, Field } from '@nestjs/graphql';
import { SearchResultUnion } from './search-result.union';
import { PaginationMeta } from 'src/core/helper/pagination/pagination.output';

@ObjectType()
export class PaginatedSearch {
  @Field(() => [SearchResultUnion])
  items: (typeof SearchResultUnion)[];

  @Field(() => PaginationMeta)
  pagination: PaginationMeta;
}
