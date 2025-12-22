import { Field, ObjectType } from '@nestjs/graphql';
import { PaginatedType } from 'src/core/helper/pagination/pagination.output';
import { User } from './user.entity';

@ObjectType()
export class PaginatedUser extends PaginatedType(User) {}
