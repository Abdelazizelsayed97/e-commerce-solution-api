import { Injectable } from '@nestjs/common';
import { QueueService } from 'src/queue/queue.service';

@Injectable()
export class EmailService {
  constructor(readonly queueService: QueueService) {}

  async sendVerificationEmail(user: any, code: string) {
    await this.queueService.addEmail('verification', { user, code });
  }

  async sendStatusNotification(
    user: any,
    entityName: string,
    newStatus: string,
  ) {
    await this.queueService.addEmail('statusNotification', {
      user,
      entityName,
      newStatus,
    });
  }
}
