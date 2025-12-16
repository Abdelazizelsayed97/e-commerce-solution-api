import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { CreatePaymentInput } from './create-payment.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdatePaymentInput extends PartialType(CreatePaymentInput) {
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  @Field(() => String)
  id: string;
}
