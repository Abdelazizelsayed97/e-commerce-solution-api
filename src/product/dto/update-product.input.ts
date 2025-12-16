import { CreateProductInput } from './create-product.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

@InputType()
export class UpdateProductInput extends PartialType(CreateProductInput) {
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  @Field(() => String)
  productId: string;
}
