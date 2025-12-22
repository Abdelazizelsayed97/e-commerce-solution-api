import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { TransactionService } from './transaction.service';
import { Transaction } from './entities/transaction.entity';
import { CreateTransactionInput } from './dto/create-transaction.input';
import { PaginationInput } from 'src/core/helper/pagination/paginatoin-input';
import { UseGuards } from '@nestjs/common';
import { RolesGuard } from 'src/auth/guards/role.guard';

import { RoleEnum } from 'src/core/enums/role.enum';
import { Roles } from 'src/core/helper/decorators/role.mata.decorator';
import { PaginationTransaction } from './entities/transaction.pagination';

@Roles(RoleEnum.superAdmin)
@UseGuards(RolesGuard)
@Resolver(() => Transaction)
export class TransactionResolver {
  constructor(private readonly transactionService: TransactionService) {}

  @Mutation(() => Transaction)
  createTransaction(
    @Args('createTransactionInput')
    createTransactionInput: CreateTransactionInput,
  ) {
    return this.transactionService.create(createTransactionInput);
  }

  @Query(() => PaginationTransaction, { name: 'transaction' })
  async findAllTransactions(
    @Args('paginationInput') paginationInput: PaginationInput,
  ) {
    return this.transactionService.findAllTransactions(paginationInput);
  }

  @Query(() => Transaction, { name: 'transaction' })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.transactionService.findOne(id);
  }

  @Mutation(() => Transaction)
  removeTransaction(@Args('id', { type: () => String }) id: string) {
    return this.transactionService.remove(id);
  }
}
