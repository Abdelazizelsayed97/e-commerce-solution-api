import { registerEnumType } from "@nestjs/graphql";

export enum stockHistoryActionEnum {
  SOLD = 'sold',
  REFUNDED = 'refunded',
  ADJUSTED = 'adjusted',
  ADDED = 'added',
}
registerEnumType(stockHistoryActionEnum, { name: 'stockHistoryAction' });