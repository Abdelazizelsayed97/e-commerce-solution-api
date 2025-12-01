import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateAddressInput {
  @Field(() => String)
  id: string;
  @Field(() => String)
  state: string;
  @Field(() => String)
  city: string;
  @Field(() => String)
  details: string;
  @Field(() => String)
  userid: string;
}
