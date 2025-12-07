import { InputType, Int, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber, Min, Max, IsString } from 'class-validator';

@InputType()
export class CreateRatingAndReviewInput {
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(5)
  @Field(() => Int)
  rating: number;

  @IsNotEmpty()
  @IsString()
  @Field(() => String)
  comment: string;
  @IsNotEmpty()
  @IsString()
  @Field(() => String)
  productId: string;
}
