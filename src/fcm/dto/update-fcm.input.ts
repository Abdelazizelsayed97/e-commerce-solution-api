import { CreateFcmInput } from './create-fcm.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateFcmInput extends PartialType(CreateFcmInput) {
  @Field(() => String)
  id: string;
}
