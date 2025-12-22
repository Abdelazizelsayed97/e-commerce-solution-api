import { PaginatedType } from 'src/core/helper/pagination/pagination.output';
import { VendorTransaction } from './vendor-transaction.entity';

export class PaginatedVendorTransactoin extends PaginatedType(
  VendorTransaction,
) {}
