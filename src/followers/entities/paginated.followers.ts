import { Field, ObjectType } from '@nestjs/graphql';
import { PaginationMeta } from 'src/core/helper/pagination/pagination.output';
import { Follower } from './follower.entity';

@ObjectType()
export class PaginatedFollowers {
  @Field(() => [Follower])
  followers: Follower[];
  @Field(() => PaginationMeta)
  meta: PaginationMeta;
}
