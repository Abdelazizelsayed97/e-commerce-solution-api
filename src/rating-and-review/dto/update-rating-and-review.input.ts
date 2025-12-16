import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { CreateRatingAndReviewInput } from './create-rating-and-review.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateRatingAndReviewInput extends PartialType(CreateRatingAndReviewInput) {
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  @Field(() => String)
  id: string;
}
