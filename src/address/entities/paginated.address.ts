import { Field, ObjectType } from '@nestjs/graphql';
import { Address } from './address.entity';
import { PaginatedType } from 'src/core/helper/pagination/pagination.output';
@ObjectType()
export class PaginatedAddress extends PaginatedType(Address) {}
