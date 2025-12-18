import { ObjectType, Field } from '@nestjs/graphql';

export interface ISendOtpResponse {
  id: string;
  message: string;
}

@ObjectType()
export class SendOtpResponse implements ISendOtpResponse {
  @Field()
  id: string;
   
  @Field()
  message: string;
}
