import { ObjectType, Field, Int } from "@nestjs/graphql";
import { CartItem } from "./cart-item.entity";
import { PaginationMeta } from "src/core/helper/pagination/pagination.output";

@ObjectType()
export class PaginatedCartItems {
  @Field(() => [CartItem])
  items: CartItem[];

  @Field(() => PaginationMeta)
  totalItems: PaginationMeta
}
