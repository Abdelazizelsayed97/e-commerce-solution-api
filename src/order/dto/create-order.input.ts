import { InputType, Field, Float, GraphQLTimestamp } from '@nestjs/graphql';
import { IsEnum, IsNotEmpty, IsUUID } from 'class-validator';
import { paymentMethod } from 'src/core/enums/payment.method.enum';
import { OrderPaymentStatus } from 'src/core/enums/payment.status.enum';

@InputType()
export class CreateOrderInput {
  @IsNotEmpty()
  @IsEnum(OrderPaymentStatus)
  @Field(() => OrderPaymentStatus)
  paymentStatus: OrderPaymentStatus;
  @Field(() => paymentMethod)
  @IsNotEmpty()
  @IsEnum(paymentMethod)
  paymentMethod: paymentMethod;
  @Field(() => String)
  @IsNotEmpty()
  @IsUUID()
  shippingAddressId: string;

  @Field(() => String)
  @IsNotEmpty()
  @IsUUID()
  @IsNotEmpty()
  cartId: string;
}
