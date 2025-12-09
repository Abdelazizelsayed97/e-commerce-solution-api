import { Field, ObjectType } from "@nestjs/graphql";
import { PaginationMeta } from "src/core/helper/pagination/pagination.output";
import { User } from "./user.entity";

@ObjectType()
export class PaginatedUsers {
   @Field(() => [User])
   items: User[]
   @Field(() => PaginationMeta)
   pagination: PaginationMeta


}