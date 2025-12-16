import { Field, ObjectType } from '@nestjs/graphql';
import { Cart } from './cart.entity';
import { PaginationMeta } from 'src/core/helper/pagination/pagination.output';

@ObjectType()
export class PaginatedCartResponse {
  @Field(() => Cart)
  items: Cart[];

  @Field(() => PaginationMeta)
  pagination: PaginationMeta;
}
