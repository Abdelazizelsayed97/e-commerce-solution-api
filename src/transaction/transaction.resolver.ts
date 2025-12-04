import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { TransactionService } from './transaction.service';
import { Transaction } from './entities/transaction.entity';
import { CreateTransactionInput } from './dto/create-transaction.input';
import { PaginationInput } from 'src/core/helper/pagination/paginatoin-input';

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

  @Query(() => [Transaction], { name: 'transaction' })
  async findAll(@Args('paginationInput') paginationInput: PaginationInput) {
    return this.transactionService.findAll(paginationInput); 
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
