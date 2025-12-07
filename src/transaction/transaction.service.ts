import { Injectable } from '@nestjs/common';
import { CreateTransactionInput } from './dto/create-transaction.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from './entities/transaction.entity';
import { Wallet } from 'src/wallet/entities/wallet.entity';
import { PaginationInput } from 'src/core/helper/pagination/paginatoin-input';
import { PaginatedResponse } from 'src/core/helper/pagination/pagination.output';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    @InjectRepository(Wallet)
    private walletRepository: Repository<Wallet>,
  ) {}
  async create(createTransactionInput: CreateTransactionInput) {
    const isExist = await this.transactionRepository.findOne({
      where: {
        id: createTransactionInput.orderId,
      },
    });
    if (isExist) {
      throw new Error('transaction already exist');
    }
    const transaction = this.transactionRepository.create(
      createTransactionInput,
    );

    const wallet = await this.walletRepository.findOne({
      where: {
        user: {
          id: transaction.user.id,
        },
      },
    });
    wallet!.balance += transaction.amount;
    await this.walletRepository.save(wallet!);
    await this.transactionRepository.save(transaction);
    return transaction;
  }

  async findAll(
    paginationInput: PaginationInput,
  ): Promise<PaginatedResponse<Transaction>> {
    const [items, itemCount] = await this.transactionRepository.findAndCount({
      skip: (paginationInput.page - 1) * paginationInput.limit,
      take: paginationInput.limit,
      order: {
        createdAt: 'DESC',
      },
    });
    return {
      items: items,
      PaginationMeta: {
        itemCount,
        itemsPerPage: paginationInput.limit,
        totalItems: itemCount,
        totalPages: Math.ceil(itemCount / paginationInput.limit),
        currentPage: paginationInput.page,
      },
    };
  }

  async findOne(id: string) {
    const isExist = await this.transactionRepository.findOne({
      where: {
        id: id,
      },
    });
    if (!isExist) {
      throw new Error('transaction not found');
    }
    return isExist;
  }

  async remove(id: string) {
    return await this.transactionRepository.delete(id);
  }
}
