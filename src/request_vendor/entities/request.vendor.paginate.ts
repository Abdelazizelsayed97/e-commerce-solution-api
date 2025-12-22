import { Field, ObjectType } from '@nestjs/graphql';
import { PaginatedType } from 'src/core/helper/pagination/pagination.output';
import { RequestVendor } from './request_vendor.entity';

@ObjectType()
export class PaginatedRequestVendor extends PaginatedType(RequestVendor) {}
