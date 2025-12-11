import { Field, ObjectType } from '@nestjs/graphql';
import { Address } from './address.entity';
@ObjectType()
export class PaginatedAddress {
  @Field(() => [Address])
  items: Address[];

  @Field(() => Number)
  totalCount: number;
}
