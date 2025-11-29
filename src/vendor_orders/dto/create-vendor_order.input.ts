import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateVendorOrderInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
