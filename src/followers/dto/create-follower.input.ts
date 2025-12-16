import { InputType, Int, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

@InputType()
export class CreateFollowerInput {
  @IsUUID()
  @IsNotEmpty()
  @IsString()
  @Field(() => String)
  vendorId: string;
  @IsUUID()
  @IsNotEmpty()
  @IsString()
  @Field(() => String)
  followerId: string;
}
