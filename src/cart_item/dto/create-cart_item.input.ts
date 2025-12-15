import { InputType, Field, Float, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

@InputType()
export class CreateCartItemInput {
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  @Field(() => String)
  productId: string;

  @IsNotEmpty()
  @Field(() => Int)
  quantity: number;
}
