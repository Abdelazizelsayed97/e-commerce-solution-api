import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class PaginationMeta {
  @Field(() => Int)
  totalItems: number;

  @Field(() => Int)
  itemCount: number;

  @Field(() => Int)
  itemsPerPage: number;

  @Field(() => Int)
  totalPages: number;

  @Field(() => Int)
  currentPage: number;
}

@ObjectType({
  isAbstract: true
})
export class PaginatedResponse<T> {
  @Field(() => [Object])
  items: T[];

  @Field(() => PaginationMeta)
  PaginationMeta: PaginationMeta;
}
