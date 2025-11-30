import { CreateQueueInput } from './create-queue.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateQueueInput extends PartialType(CreateQueueInput) {
  @Field(() => Int)
  id: number;
}
