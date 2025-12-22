import { Injectable } from '@nestjs/common';
import { CreateNotificationInput } from './dto/create-notification.input';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Notification } from './entities/notification.entity';
import { PaginationInput } from 'src/core/helper/pagination/paginatoin-input';
import { PaginatedNotification } from './entities/paginated.notification';
import { EmailService } from 'src/email/email.service';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
    private readonly emailService: EmailService,
  ) {}
  async sendNotification(createNotificationInput: CreateNotificationInput) {
    const notification = Object.create(createNotificationInput);
    await this.emailService.sendStatusNotification(
      notification.user,
      notification.subject,
      notification.message,
    );

    return this.notificationRepository.save(notification);
  }

  async getAllnotifications(
    paginate: PaginationInput,
  ): Promise<PaginatedNotification> {
    const skip = paginate.limit * (paginate.page - 1);
    const [items, totalItems] = await this.notificationRepository.findAndCount({
      skip,
      take: paginate.limit,
    });
    return {
      items: items,
      limit: paginate.limit,
      page: paginate.page,
      total: totalItems,
    };
  }

  async remove(id: string) {
    return await this.notificationRepository.delete(id);
  }
}
