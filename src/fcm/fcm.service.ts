import { Injectable } from '@nestjs/common';
import { CreateFcmInput } from './dto/create-fcm.input';
import { UpdateFcmInput } from './dto/update-fcm.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Fcm } from './entities/fcm.entity';
import { PaginationInput } from 'src/core/helper/pagination/paginatoin-input';
import { PaginatedResponse } from 'src/core/helper/pagination/pagination.output';

@Injectable()
export class FcmService {
  constructor(
    @InjectRepository(Fcm)
    private fcmRepository: Repository<Fcm>,
  ) {}
  async create(createFcmInput: CreateFcmInput) {
    if (createFcmInput.userId === null || createFcmInput.userId === undefined) {
      throw new Error('User ID is required');
    }
    const isExist = await this.fcmRepository.findOne({
      where: {
        user: {
          id: createFcmInput.userId,
        },
      },
    });
    if (isExist) {
      throw new Error('FCM already exists for this user');
    }
    const fcm = await this.fcmRepository.create({
      ...createFcmInput,
    });
    await this.fcmRepository.save(fcm);
    return fcm;
  }

  async findAll(
    paginateInput: PaginationInput,
  ): Promise<PaginatedResponse<Fcm>> {
    const [items, itemCount] = await this.fcmRepository.findAndCount({
      skip: (paginateInput.page - 1) * paginateInput.limit,
      take: paginateInput.limit,
      order: {
        createdAt: 'DESC',
      },
    });

    return {
      items: items,
      PaginationMeta: {
        totalItems: itemCount,
        itemCount: items.length,
        itemsPerPage: paginateInput.limit,
        totalPages: Math.ceil(itemCount / paginateInput.limit),
        currentPage: paginateInput.page,
      },
    };
  }

  async findOne(id: string) {
    const fcm = await this.fcmRepository.findOne({
      where: {
        id: id,
      },
    });
    if (!fcm) {
      throw new Error('FCM not found');
    }
    return fcm;
  }

  async update(id: string, updateFcmInput: UpdateFcmInput) {
    const fcm = await this.findOne(id);
    Object.assign(fcm, updateFcmInput);
    await this.fcmRepository.save(fcm);
    return fcm;
  }

  async remove(id: string) {
await this.fcmRepository.delete(id)
  }
}
