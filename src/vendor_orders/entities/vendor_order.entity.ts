import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class VendorOrder {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
