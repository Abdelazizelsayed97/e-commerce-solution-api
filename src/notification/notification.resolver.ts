import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { NotificationService } from './notification.service';
import { Notification } from './entities/notification.entity';
import { CreateNotificationInput } from './dto/create-notification.input';

@Resolver(() => Notification)
export class NotificationResolver {
  constructor(private readonly notificationService: NotificationService) {}

  @Mutation(() => Notification)
  createNotification(
    @Args('sendNotification') createNotificationInput: CreateNotificationInput,
  ) {
    return this.notificationService.sendNotification(createNotificationInput);
  }

  @Query(() => [Notification], { name: 'notification' })
  findAll() {
    return this.notificationService.findAllNotification();
  }

  @Mutation(() => Notification)
  removeNotification(@Args('id', { type: () => Int }) id: number) {
    return this.notificationService.remove(id);
  }
}
