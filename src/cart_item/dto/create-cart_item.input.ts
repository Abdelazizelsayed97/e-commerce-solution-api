import { InputType, Field, Float, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber, IsString, IsUUID } from 'class-validator';

@InputType()
export class CreateCartItemInput {
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  @Field(() => String)
  productId: string;

  @IsNotEmpty()
  @IsNumber()
  @Field(() => Int)
  quantity: number;
}
