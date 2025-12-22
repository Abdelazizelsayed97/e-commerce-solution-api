import { ObjectType } from '@nestjs/graphql';

import { PaginatedType } from 'src/core/helper/pagination/pagination.output';
import { Product } from './product.entity';

@ObjectType()
export class PaginatedProduct extends PaginatedType(Product) {}
