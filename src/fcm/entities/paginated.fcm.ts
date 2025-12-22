import { PaginatedType } from 'src/core/helper/pagination/pagination.output';
import { Fcm } from './fcm.entity';
import { ObjectType } from '@nestjs/graphql';

@ObjectType()
export class PaginatedFcm extends PaginatedType(Fcm) {}
