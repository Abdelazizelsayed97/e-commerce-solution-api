import { Module } from '@nestjs/common';
import { EmailService } from './email.service';

import { EmailWorker } from './workers/email.worker';

import { ConfigModule } from '@nestjs/config';

import { SendGridService } from './sendgrid.services';
import { QueueModule } from 'src/queue/queue.module';

@Module({
  providers: [EmailService, SendGridService, EmailWorker],
  exports: [EmailService, SendGridService],
  imports: [QueueModule, ConfigModule],
})
export class EmailModule {}
