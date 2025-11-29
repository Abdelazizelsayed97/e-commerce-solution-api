import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateFcmInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
