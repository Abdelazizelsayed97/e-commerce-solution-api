import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Fcm {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
