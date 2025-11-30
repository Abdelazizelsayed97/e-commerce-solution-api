import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Queue {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
