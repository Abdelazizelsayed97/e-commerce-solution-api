import { ObjectType } from '@nestjs/graphql';
import { SearchResultUnion } from './search-result.union';
import { PaginatedType } from 'src/core/helper/pagination/pagination.output';

@ObjectType()
export class PaginatedSearch extends PaginatedType(SearchResultUnion as any) {}
