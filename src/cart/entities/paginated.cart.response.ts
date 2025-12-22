import { Field, ObjectType } from '@nestjs/graphql';
import { Cart } from './cart.entity';
import { PaginatedType } from 'src/core/helper/pagination/pagination.output';

@ObjectType()
export class PaginatedCartResponse extends PaginatedType(Cart) {}
