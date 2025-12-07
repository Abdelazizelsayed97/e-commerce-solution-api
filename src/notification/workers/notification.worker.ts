import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { SendGridService } from 'src/email/sendgrid.services';

@Processor('notification')
export class NotificationWorker extends WorkerHost {
  constructor(private readonly sendGrid: SendGridService) {
    super();
  }
   async process(job: Job, token?: string): Promise<any> {
     
  }
}
