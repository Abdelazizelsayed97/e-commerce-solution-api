import { InputType, Int, Field, GraphQLTimestamp } from '@nestjs/graphql';

@InputType()
export class CreateCartInput {
  @Field(() => String)
  userId: string;
  @Field(() => GraphQLTimestamp, { nullable: true })
  createAt?: number;
  @Field(() => GraphQLTimestamp, { nullable: true })
  updateAt?: number;
}
