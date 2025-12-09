import { ObjectType, Field } from "@nestjs/graphql";
import { PaginationMeta } from "src/core/helper/pagination/pagination.output";
import { Vendor } from "./vendor.entity";

@ObjectType('VendorPaginated')
export class VendorPaginated {
   @Field(() => [Vendor])
   items: Vendor[];

   @Field(() => PaginationMeta)
   pagination: PaginationMeta;
}