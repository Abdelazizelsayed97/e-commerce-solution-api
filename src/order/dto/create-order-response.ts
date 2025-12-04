import { ObjectType, Field } from '@nestjs/graphql';
import { Order } from '../entities/order.entity';

@ObjectType()
export class CreateOrderResponse {
  @Field(() => Order)
  order: Order;

  @Field(() => String, { nullable: true })
  paymentUrl?: string;
}
