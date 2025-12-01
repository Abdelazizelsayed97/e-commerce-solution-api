import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';

@Injectable()
export class QueueService {
  constructor(
    @InjectQueue('email') readonly emailQueue: Queue,
    @InjectQueue('notification') readonly notificationQueue: Queue,
  ) {}

  async addEmail(name: string, data: any) {
    await this.emailQueue.add(name, data);
  }
  async addNotification(name: string, data: any) {
    await this.notificationQueue.add(name, data);
  }
}
