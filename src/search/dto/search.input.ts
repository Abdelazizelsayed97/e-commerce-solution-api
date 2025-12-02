import { InputType, Field } from '@nestjs/graphql';
import { PaginationInput } from 'src/core/helper/pagination/paginatoin-input';

@InputType()
export class SearchInput extends PaginationInput {
  @Field()
  searchKey: string;
}
