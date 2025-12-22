import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationResolver } from './notification.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from './entities/notification.entity';
import { EmailModule } from 'src/email/email.module';

@Module({
  providers: [NotificationResolver, NotificationService],
  exports: [NotificationService],
  imports: [TypeOrmModule.forFeature([Notification]), EmailModule],
})
export class NotificationModule {}
