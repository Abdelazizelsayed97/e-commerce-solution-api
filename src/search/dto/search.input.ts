import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';
import { PaginationInput } from 'src/core/helper/pagination/paginatoin-input';

@InputType()
export class SearchInput extends PaginationInput {
  @IsNotEmpty()
  @Field()
  searchKey: string;
}
