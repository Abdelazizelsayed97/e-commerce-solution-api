import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VendorTransaction } from './entities/vendor-transaction.entity';
import { Vendor } from 'src/vendor/entities/vendor.entity';
import { Order } from 'src/order/entities/order.entity';
import { PaginationInput } from 'src/core/helper/pagination/paginatoin-input';
import { PaginatedResponse } from 'src/core/helper/pagination/pagination.output';

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

  async findAll(
    paginationInput: PaginationInput,
  ): Promise<PaginatedResponse<VendorTransaction>> {
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
      PaginationMeta: {
        itemCount,
        itemsPerPage: paginationInput.limit,
        totalItems: itemCount,
        totalPages: Math.ceil(itemCount / paginationInput.limit),
        currentPage: paginationInput.page,
      },
    };
  }

  async findByVendor(
    vendorId: string,
    paginationInput: PaginationInput,
  ): Promise<PaginatedResponse<VendorTransaction>> {
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
      PaginationMeta: {
        itemCount,
        itemsPerPage: paginationInput.limit,
        totalItems: itemCount,
        totalPages: Math.ceil(itemCount / paginationInput.limit),
        currentPage: paginationInput.page,
      },
    };
  }

  async findByOrder(orderId: string): Promise<VendorTransaction[]> {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
    });
    if (!order) {
      throw new Error('Order not found');
    }

    return await this.vendorTransactionRepository.find({
      where: { order: { id: orderId } },
      relations: ['vendor', 'order'],
      order: {
        createdAt: 'DESC',
      },
    });
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
