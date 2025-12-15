import { InputType, Int, Field, GraphQLTimestamp } from '@nestjs/graphql';
import { IsEnum, IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { Device } from 'src/core/enums/device.type';
import { User } from 'src/user/entities/user.entity';

@InputType()
export class CreateFcmInput {
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  @Field(() => String)
  userId: string;

  @IsNotEmpty()
  @IsString()
  @Field(() => String)
  token: string; 
  
  @IsEnum(Device)
  @IsNotEmpty()
  @Field(() => Device)
  device: Device;
}
