import { Injectable } from '@nestjs/common';
import { CreateNotificationInput } from './dto/create-notification.input';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Notification } from './entities/notification.entity';
import { PaginatedResponse } from 'src/core/helper/pagination/pagination.output';
import { PaginationInput } from 'src/core/helper/pagination/paginatoin-input';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
  ) {}
  async sendNotification(createNotificationInput: CreateNotificationInput) {
    const notification = Object.create(createNotificationInput);
    return this.notificationRepository.save(notification);
  }

  async getAllnotifications(
    paginate: PaginationInput,
  ): Promise<PaginatedResponse<Notification>> {
    const skip = paginate.limit * (paginate.page - 1);
    const [items, totalItems] = await this.notificationRepository.findAndCount({
      skip,
      take: paginate.limit,
    });
    return {
      items: await this.notificationRepository.find(),
      PaginationMeta: {
        totalItems: totalItems,
        itemCount: items.length,
        itemsPerPage: paginate.limit,
        totalPages: Math.ceil(totalItems / paginate.limit),
        currentPage: paginate.page,
      },
    };
  }

  async remove(id: number) {
    return await this.notificationRepository.delete(id);
  }
}
