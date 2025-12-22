import { Injectable } from '@nestjs/common';
import { CreateTransactionInput } from './dto/create-transaction.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from './entities/transaction.entity';
import { Wallet } from 'src/wallet/entities/wallet.entity';
import { User } from 'src/user/entities/user.entity';
import { Order } from 'src/order/entities/order.entity';
import { PaginationInput } from 'src/core/helper/pagination/paginatoin-input';

import { PaginationTransaction } from './entities/transaction.pagination';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    @InjectRepository(Wallet)
    private walletRepository: Repository<Wallet>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
  ) {}
  async create(createTransactionInput: CreateTransactionInput) {
    const user = await this.userRepository.findOne({
      where: { id: createTransactionInput.userId },
    });
    if (!user) {
      throw new Error('User not found');
    }

    const order = await this.orderRepository.findOne({
      where: { id: createTransactionInput.orderId },
    });
    if (!order) {
      throw new Error('Order not found');
    }

    const wallet = await this.walletRepository.findOne({
      where: { user: { id: createTransactionInput.userId } },
    });
    if (!wallet) {
      throw new Error('Wallet not found');
    }

    wallet.balance += createTransactionInput.amount;

    const transaction = this.transactionRepository.create({
      ...createTransactionInput,
      user,
      order,
      wallet,
      balanceAfter: wallet.balance,
    });

    await this.walletRepository.save(wallet);
    const savedTransaction = await this.transactionRepository.save(transaction);

    order.transactionId = savedTransaction.id;

    await this.orderRepository.save(order);

    return savedTransaction;
  }

  async findAllTransactions(
    paginationInput: PaginationInput,
  ): Promise<PaginationTransaction> {
    const [items, itemCount] = await this.transactionRepository.findAndCount({
      skip: (paginationInput.page - 1) * paginationInput.limit,
      take: paginationInput.limit,
      order: {
        createdAt: 'DESC',
      },
    });
    return {
      items: items,
      limit: paginationInput.limit,
      page: paginationInput.page,
      total: itemCount,
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
