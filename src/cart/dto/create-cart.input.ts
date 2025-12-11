import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class CreateCartInput {
  @IsNotEmpty()
  @IsString()
  @Field(() => String)
  userId: string;
}
