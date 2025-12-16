import { Field, InputType } from '@nestjs/graphql';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
} from 'class-validator';
import { TransactionTypeEnum } from 'src/core/enums/transaction.enum';

@InputType()
export class CreateTransactionInput {
  @IsEnum(TransactionTypeEnum)
  @IsNotEmpty()
  @Field({
    defaultValue: TransactionTypeEnum.ADJUSTMENT,
  })
  type: TransactionTypeEnum;

  @IsNotEmpty()
  @Field()
  @IsNumber()
  amount: number;

  @IsNotEmpty()
  @Field()
  @IsUUID()
  orderId: string;

  @IsNotEmpty()
  @Field()
  @IsUUID()
  userId: string;

  @Field({ nullable: true })
  @IsString()
  description?: string;
}
