import { InputType, Int, Field, Float } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber, IsString, IsUUID } from 'class-validator';

@InputType()
export class CreateWalletInput {
  @IsNotEmpty()
  @IsNumber()
  @Field(() => Float)
  balance: number;

  @IsNotEmpty()
  @IsNumber()
  @Field(() => Float)
  pendingBalance: number;
  
  @IsNotEmpty()
  @IsString()
  @Field(() => String)
  currency: string;

  @IsNotEmpty()
  @IsString()
  @Field(() => String)
  type: string;

  @IsNotEmpty()
  @IsString()
  @Field(() => String)
  transactionHistory: string[];

  @IsNotEmpty()
  @IsString()
  @IsUUID()
  @Field(() => String)
  userId: string;
}
