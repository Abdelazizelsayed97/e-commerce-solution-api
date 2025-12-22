import { Resolver, Query, Args, Int } from '@nestjs/graphql';
import { VendorTransactionService } from './vendor-transaction.service';
import { VendorTransaction } from './entities/vendor-transaction.entity';
import { PaginationInput } from 'src/core/helper/pagination/paginatoin-input';

import { UseGuards } from '@nestjs/common';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { RoleEnum } from 'src/core/enums/role.enum';
import { Roles } from 'src/core/helper/decorators/role.mata.decorator';
import { PaginatedVendorTransactoin } from './entities/vendor.transcation.paginated';

@Resolver(() => VendorTransaction)
export class VendorTransactionResolver {
  constructor(
    private readonly vendorTransactionService: VendorTransactionService,
  ) {}

  @Query(() => PaginatedVendorTransactoin, { name: 'vendorTransactions' })
  @UseGuards(RolesGuard)
  @Roles(RoleEnum.superAdmin)
  findAllVendorTransactions(
    @Args('paginationInput') paginationInput: PaginationInput,
  ) {
    return this.vendorTransactionService.findAllVendorTransactions(
      paginationInput,
    );
  }

  @Query(() => PaginatedVendorTransactoin, {
    name: 'vendorTransactionsByVendor',
  })
  @UseGuards(RolesGuard)
  @Roles(RoleEnum.superAdmin)
  findByVendor(
    @Args('vendorId') vendorId: string,
    @Args('paginationInput') paginationInput: PaginationInput,
  ) {
    return this.vendorTransactionService.findByVendor(
      vendorId,
      paginationInput,
    );
  }

  @Query(() => PaginatedVendorTransactoin, {
    name: 'vendorTransactionsByOrder',
  })
  @UseGuards(RolesGuard)
  @Roles(RoleEnum.superAdmin, RoleEnum.vendor)
  findByOrder(
    @Args('orderId') orderId: string,
    @Args('paginationInput') paginationInput: PaginationInput,
  ) {
    return this.vendorTransactionService.findByOrder(orderId, paginationInput);
  }

  @Query(() => VendorTransaction, { name: 'vendorTransaction' })
  @UseGuards(RolesGuard)
  @Roles(RoleEnum.superAdmin, RoleEnum.vendor)
  findOne(@Args('id') id: string) {
    return this.vendorTransactionService.findOne(id);
  }
}
