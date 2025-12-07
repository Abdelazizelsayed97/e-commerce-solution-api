import { InputType, Int, Field, GraphQLTimestamp } from '@nestjs/graphql';
import { Device } from 'src/core/enums/device.type';
import { User } from 'src/user/entities/user.entity';

@InputType()
export class CreateFcmInput {

  @Field(() => String)
  userId: string;
  @Field(() => String)
  token: string;
  @Field(() => Device)
  device: Device;
  @Field(() => GraphQLTimestamp)
  createdAt: number;
}
