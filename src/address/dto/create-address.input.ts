import { InputType, Int, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class CreateAddressInput {
  @IsNotEmpty()
  @IsString()
  @Field(() => String)
  state: string;
  @IsNotEmpty()
  @IsString()
  @Field(() => String)

  city: string;
  @IsNotEmpty()
  @IsString()
  @Field(() => String)
  details: string;
  @IsNotEmpty()
  @IsString()
  @Field(() => String)
  userid: string;
}
