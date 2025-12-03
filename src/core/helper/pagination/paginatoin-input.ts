import { InputType, Field, Int, Float } from '@nestjs/graphql';
import { IsInt } from 'class-validator';

@InputType()
export class PaginationInput {
  @IsInt()
  @Field(() => Int, { nullable: true })
  page: number;

  @IsInt()
  @Field(() => Int, { nullable: true })
  limit: number;
}
