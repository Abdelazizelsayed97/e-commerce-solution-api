import { InputType, Int, Field } from '@nestjs/graphql';
import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';

@InputType()
export class CreateVendorInput {
  @IsNotEmpty()
  @IsString()
  @Field(() => String)
  user_id: string;
  @IsNotEmpty()
  @IsString()
  @Field(() => String)
  shopName: string;
  @IsNotEmpty()
  @IsNumber()
  @Field(() => Int)
  balance?: number;
  @IsNotEmpty()
  @IsNumber()
  @Field(() => Int)
  rating: number;
  @IsNotEmpty()
  @IsBoolean()
  @Field(() => Boolean)
  isVerfied: boolean;
}
