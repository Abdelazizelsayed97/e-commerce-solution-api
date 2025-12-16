import { InputType, Int, Field } from '@nestjs/graphql';
import { IsAlpha, isAlpha, IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class CreateCategoryInput {
  @IsNotEmpty()
  @IsString()
  @IsAlpha()
  @Field(() => String)
  name: string;
}
