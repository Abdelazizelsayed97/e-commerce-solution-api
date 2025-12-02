

import { ObjectType, Field } from '@nestjs/graphql';

import { PaginationMeta } from 'src/core/helper/pagination/pagination.output';
import { Product } from './product.entity';

@ObjectType()
export class PaginatedProduct {
  @Field(() => [Product])
  items: Product[];

  @Field(() => PaginationMeta)
  pagination: PaginationMeta;
}
