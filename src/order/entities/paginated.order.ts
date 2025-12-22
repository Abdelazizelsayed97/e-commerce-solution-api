import { Field, ObjectType } from '@nestjs/graphql';
import { Order } from './order.entity';
import { PaginatedType } from 'src/core/helper/pagination/pagination.output';

@ObjectType()
export class PaginatedOrder extends PaginatedType(Order) {}
