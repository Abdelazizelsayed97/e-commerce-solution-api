import { ObjectType, Field, Int } from "@nestjs/graphql";
import { CartItem } from "./cart-item.entity";
import { PaginatedType } from "src/core/helper/pagination/pagination.output";


@ObjectType()
export class PaginatedCartItems extends PaginatedType(CartItem) { }

