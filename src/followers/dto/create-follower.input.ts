import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateFollowerInput {
  @Field(() => String)
  vendorId: string;
  @Field(() => String)
  followerId: string;
}
