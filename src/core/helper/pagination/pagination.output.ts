import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Type } from '@nestjs/common';

export function PaginatedType<T>(ItemType: Type<T>) {
  @ObjectType({ isAbstract: true })
  abstract class Paginated {
    @Field(() => [ItemType])
    items: T[];

    @Field(() => Int)
    total: number;

    @Field(() => Int)
    page: number;

    @Field(() => Int)
    limit: number;
  }

  return Paginated;
}
