import { PaginatedType } from 'src/core/helper/pagination/pagination.output';
import { Notification } from './notification.entity';
import { ObjectType } from '@nestjs/graphql';

@ObjectType()
export class PaginatedNotification extends PaginatedType(Notification) {}
