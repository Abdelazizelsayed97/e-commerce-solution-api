import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VendorTransaction } from './entities/vendor-transaction.entity';
import { Vendor } from 'src/vendor/entities/vendor.entity';
import { Order } from 'src/order/entities/order.entity';
import { PaginationInput } from 'src/core/helper/pagination/paginatoin-input';

import { PaginatedVendorTransactoin } from './entities/vendor.transcation.paginated';

@Injectable()
export class VendorTransactionService {
  constructor(
    @InjectRepository(VendorTransaction)
    private vendorTransactionRepository: Repository<VendorTransaction>,
    @InjectRepository(Vendor)
    private vendorRepository: Repository<Vendor>,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
  ) {}

  async findAllVendorTransactions(
    paginationInput: PaginationInput,
  ): Promise<PaginatedVendorTransactoin> {
    const [items, itemCount] =
      await this.vendorTransactionRepository.findAndCount({
        skip: (paginationInput.page - 1) * paginationInput.limit,
        take: paginationInput.limit,
        order: {
          createdAt: 'DESC',
        },
        relations: ['vendor', 'order'],
      });
    return {
      items: items,
      page: paginationInput.page,
      total: itemCount,
      limit: paginationInput.limit,
    };
  }

  async findByVendor(
    vendorId: string,
    paginationInput: PaginationInput,
  ): Promise<PaginatedVendorTransactoin> {
    const vendor = await this.vendorRepository.findOne({
      where: { id: vendorId },
    });
    if (!vendor) {
      throw new Error('Vendor not found');
    }

    const [items, itemCount] =
      await this.vendorTransactionRepository.findAndCount({
        where: { vendor: { id: vendorId } },
        skip: (paginationInput.page - 1) * paginationInput.limit,
        take: paginationInput.limit,
        order: {
          createdAt: 'DESC',
        },
        relations: ['vendor', 'order'],
      });
    return {
      items: items,
      page: paginationInput.page,
      total: itemCount,
      limit: paginationInput.limit,
    };
  }

  async findByOrder(
    orderId: string,
    paginationInput: PaginationInput,
  ): Promise<PaginatedVendorTransactoin> {
    const orders = await this.orderRepository.findOne({
      where: { id: orderId },
    });
    if (!orders) {
      throw new Error('Order not found');
    }

    const [items, itemCount] =
      await this.vendorTransactionRepository.findAndCount({
        where: { order: { id: orderId } },
        relations: ['vendor', 'order'],
        order: {
          createdAt: 'DESC',
        },
      });

    return {
      items: items,
      total: itemCount,
      limit: paginationInput.limit,
      page: paginationInput.page,
    };
  }

  async findOne(id: string): Promise<VendorTransaction> {
    const transaction = await this.vendorTransactionRepository.findOne({
      where: { id },
      relations: ['vendor', 'order'],
    });
    if (!transaction) {
      throw new Error('Vendor transaction not found');
    }
    return transaction;
  }
}
