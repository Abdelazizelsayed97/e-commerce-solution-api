import { registerEnumType } from '@nestjs/graphql';

export enum OrderShippingStatusEnum {
   PENDING = 'PENDING',
   PROCESSING = 'PROCESSING',
   SHIPPED = 'SHIPPED',
   DELIVERED = 'DELIVERED',
   CANCELLED = 'CANCELLED',
}

registerEnumType(OrderShippingStatusEnum, { name: 'OrderStatusEnum' });
