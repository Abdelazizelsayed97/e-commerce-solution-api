import { Field, ObjectType } from '@nestjs/graphql';
import { PaginatedType } from 'src/core/helper/pagination/pagination.output';
import { Follower } from './follower.entity';

@ObjectType()
export class PaginatedFollowers extends PaginatedType(Follower) {}
