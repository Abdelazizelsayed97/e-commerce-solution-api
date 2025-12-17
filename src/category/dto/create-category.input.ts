import { InputType, Field } from '@nestjs/graphql';
import { IsAlpha, IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class CreateCategoryInput {
  @IsNotEmpty()
  @IsString()
  @IsAlpha()
  @Field(() => String)
  name: string;
}
