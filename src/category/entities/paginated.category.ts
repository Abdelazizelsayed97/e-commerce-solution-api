import { PaginatedType } from 'src/core/helper/pagination/pagination.output';
import { Category } from './category.entity';
import { ObjectType } from '@nestjs/graphql';

@ObjectType()
export class PaginatedCategory extends PaginatedType(Category) {}
