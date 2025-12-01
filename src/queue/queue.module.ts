import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { QueueService } from './queue.service';

@Module({
  imports: [
    BullModule.forRoot({
      connection: {
        host: 'redis-18773.crce176.me-central-1-1.ec2.redns.redis-cloud.com',
        port: 18773,
        password: 'qm5ppkFZt8s1nsOjdCxX7wrEVRDoAXAO',
        name: 'test-db',
      },
    }),

    BullModule.registerQueue({
      name: 'email',
    }),
    BullModule.registerQueue({
      name: 'notification',
    }),
  ],
  providers: [QueueService],
  exports: [BullModule, QueueService],
})
export class QueueModule {
  constructor() {}
}
