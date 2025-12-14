import { Field, ObjectType } from "@nestjs/graphql";
import { Order } from "./order.entity";
import { PaginationMeta } from "src/core/helper/pagination/pagination.output";

@ObjectType()
export class PaginatedOrder {
   @Field(() => [Order])
   items: Order[];
   @Field(() => PaginationMeta)
   pagination: PaginationMeta;
}