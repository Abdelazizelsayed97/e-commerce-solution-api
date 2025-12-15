import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

@InputType()
export class CreateCartInput {
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  @Field(() => String)
  userId: string;
}
