import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { NotificationService } from './notification.service';
import { Notification } from './entities/notification.entity';
import { CreateNotificationInput } from './dto/create-notification.input';
import { PaginationInput } from 'src/core/helper/pagination/paginatoin-input';

@Resolver(() => Notification)
export class NotificationResolver {
  constructor(private readonly notificationService: NotificationService) {}

  @Mutation(() => Notification)
  createNotification(
    @Args('sendNotification') createNotificationInput: CreateNotificationInput,
  ) {
    return this.notificationService.sendNotification(createNotificationInput);
  }

  @Query(() => [Notification], { name: 'notifications' })
  findAll(
    @Args('paginationInput', { type: () => Int, nullable: true })
    paginationInput: PaginationInput,
  ) {
    return this.notificationService.getAllnotifications(paginationInput);
  }

  @Mutation(() => Notification)
  removeNotification(@Args('id', { type: () => Int }) id: number) {
    return this.notificationService.remove(id);
  }
}
