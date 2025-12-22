import { ObjectType, Field } from '@nestjs/graphql';

import { Vendor } from './vendor.entity';
import { PaginatedType } from 'src/core/helper/pagination/pagination.output';

@ObjectType()
export class VendorPaginated extends PaginatedType(Vendor) {}
