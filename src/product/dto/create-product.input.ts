import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateProductInput {
   @Field(() => String)
   name: string;

   @Field(() => String)
   type: string;
  
   @Field(() => String)
   vendorId:string ;
}
