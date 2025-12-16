import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { CreateWalletInput } from './create-wallet.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateWalletInput extends PartialType(CreateWalletInput) {
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  @Field(() => String)
  id: string;
}
