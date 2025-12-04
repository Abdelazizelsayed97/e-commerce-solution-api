import { InputType, Field, Float, GraphQLTimestamp } from '@nestjs/graphql';
import { paymentMethod } from 'src/core/enums/payment.method.enum';
import { OrderPaymentStatus } from 'src/core/enums/payment.status.enum';

@InputType()
export class CreateOrderInput {
  @Field(() => String)
  clientId: string;
  @Field(() => Float)
  totalAmount: number;
  @Field(() => OrderPaymentStatus)
  paymentStatus: OrderPaymentStatus;
  @Field(() => paymentMethod)
  paymentMethod: paymentMethod;
  @Field(() => GraphQLTimestamp)
  createdAt: number;
  @Field(() => GraphQLTimestamp)
  updatedAt: number;
  @Field(() => String)
  shippingAddressId: string;
  @Field(() => String)
  transactionId: string;
  @Field(() => String)
  cartId: string;
}
