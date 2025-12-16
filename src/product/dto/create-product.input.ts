import { InputType, Field, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional } from 'class-validator';

@InputType()
export class CreateProductInput {
  @IsNotEmpty()
  @Field(() => String)
  name: string;

  @IsNotEmpty()
  @Field(() => String)
  vendorId: string;

  @IsNotEmpty()
  @Field(() => Int)
  stock: number;

  @IsNotEmpty()
  @Field(() => Int)
  price: number;

  @IsOptional()
  @Field(() => String)
  categoryId: string;
}
