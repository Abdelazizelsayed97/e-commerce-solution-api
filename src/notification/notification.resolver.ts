import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { NotificationService } from './notification.service';
import { Notification } from './entities/notification.entity';
import { CreateNotificationInput } from './dto/create-notification.input';
import { PaginationInput } from 'src/core/helper/pagination/paginatoin-input';
import { PaginatedNotification } from './entities/paginated.notification';

@Resolver(() => Notification)
export class NotificationResolver {
  constructor(private readonly notificationService: NotificationService) {}

  @Mutation(() => Notification)
  createNotification(
    @Args('sendNotification') createNotificationInput: CreateNotificationInput,
  ) {
    return this.notificationService.sendNotification(createNotificationInput);
  }

  @Query(() => PaginatedNotification, { name: 'notifications' })
  findAllNotifications(
    @Args('paginationInput', { type: () => PaginationInput, nullable: true })
    paginationInput: PaginationInput,
  ) {
    return this.notificationService.getAllnotifications(paginationInput);
  }

  @Mutation(() => Notification)
  removeNotification(@Args('id', { type: () => String }) id: string) {
    return this.notificationService.remove(id);
  }
}
