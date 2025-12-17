import { InputType, Int, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber, IsString, IsUUID } from 'class-validator';

@InputType()
export class CreatePaymentInput {

  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  orderId: string;

  @Field(() => Int)
  @IsNotEmpty()
  @IsNumber()
  amount: number;

}
