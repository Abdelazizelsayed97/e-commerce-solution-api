import { InputType, Field, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, Min, Max } from 'class-validator';
import { PaginationInput } from 'src/core/helper/pagination/paginatoin-input';

@InputType()
export class SearchInput extends PaginationInput {
  @IsNotEmpty()
  @Field()
  searchKey: string;

  @IsOptional()
  @Field(() => String, { nullable: true })
  category?: string;

  @IsOptional()
  @Field(() => Int, { nullable: true })
  @Min(0)
  minPrice?: number;

  @IsOptional()
  @Field(() => Int, { nullable: true })
  @Min(0)
  maxPrice?: number;
}
