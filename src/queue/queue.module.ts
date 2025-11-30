import { Module } from '@nestjs/common';
import { QueueService } from './queue.service';

@Module({
  providers: [QueueService],
  exports: [QueueService],
  imports: [
    
  ],
})
export class QueueModule {}
