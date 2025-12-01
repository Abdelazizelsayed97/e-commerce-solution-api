import { Injectable } from '@nestjs/common';
import { CreateNotificationInput } from './dto/create-notification.input';

import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Notification } from './entities/notification.entity';

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

  async findAllNotification() {
    return await this.notificationRepository.find();
  }

  async remove(id: number) {
    return await this.notificationRepository.delete(id);
  }
}
