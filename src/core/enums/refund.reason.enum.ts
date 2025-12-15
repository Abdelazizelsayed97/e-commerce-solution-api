import { registerEnumType } from '@nestjs/graphql';

export enum RefundReason {
  DAMAGED_PRODUCT = 'DAMAGED_PRODUCT',
  WRONG_ITEM = 'WRONG_ITEM',
  NOT_AS_DESCRIBED = 'NOT_AS_DESCRIBED',
  NO_LONGER_NEEDED = 'NO_LONGER_NEEDED',
  DEFECTIVE = 'DEFECTIVE',
  LATE_DELIVERY = 'LATE_DELIVERY',
  OTHER = 'OTHER',
}

registerEnumType(RefundReason, { name: 'RefundReason' });
