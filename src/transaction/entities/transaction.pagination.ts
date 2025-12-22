import { ObjectType } from '@nestjs/graphql';
import { PaginatedType } from 'src/core/helper/pagination/pagination.output';
import { Transaction } from '../entities/transaction.entity';

@ObjectType()
export class PaginationTransaction extends PaginatedType(Transaction) {}
