import { InputType, Field, Int } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class CreateProductInput {
  @IsNotEmpty()
  @Field(() => String)
  name: string;
  @IsNotEmpty()
  @Field(() => String)
  type: string;
  @IsNotEmpty()
  @Field(() => String)
  vendorId: string;
   @IsNotEmpty()
   @Field(() => Int)
   stock: number
   @IsNotEmpty()
   @Field(() => Int)
   price: number
}
