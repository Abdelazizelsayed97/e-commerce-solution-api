import { InputType, Field, Float, GraphQLTimestamp } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';
import { paymentMethod } from 'src/core/enums/payment.method.enum';
import { OrderPaymentStatus } from 'src/core/enums/payment.status.enum';

@InputType()
export class CreateOrderInput {
  @IsNotEmpty()
  @Field(() => String)
  clientId: string;

  @IsNotEmpty()
  @Field(() => OrderPaymentStatus)
  paymentStatus: OrderPaymentStatus;
  @Field(() => paymentMethod)
  @IsNotEmpty()
  paymentMethod: paymentMethod;
  @Field(() => String)
  @IsNotEmpty()
  shippingAddressId: string;
  @Field(() => String)
  @IsNotEmpty()
  transactionId: string;
  @Field(() => String)
  @IsNotEmpty()
  cartId: string;
}
