import { Field, ObjectType } from '@nestjs/graphql';

import { PaginationMeta } from 'src/core/helper/pagination/pagination.output';
import { RequestVendor } from './request_vendor.entity';
@ObjectType()
export class PaginatedRequestVendor {
  @Field(() => [RequestVendor])
  items: RequestVendor[];
  @Field(() => PaginationMeta)
  pagination: PaginationMeta;
}
