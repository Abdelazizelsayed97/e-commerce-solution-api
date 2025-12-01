import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class RatingAndReview {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
