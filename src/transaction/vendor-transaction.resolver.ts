import { Resolver, Query, Args, Int } from '@nestjs/graphql';
import { VendorTransactionService } from './vendor-transaction.service';
import { VendorTransaction } from './entities/vendor-transaction.entity';
import { PaginationInput } from 'src/core/helper/pagination/paginatoin-input';
import { PaginatedResponse } from 'src/core/helper/pagination/pagination.output';
import { UseGuards } from '@nestjs/common';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { RoleEnum } from 'src/core/enums/role.enum';
import { Roles } from 'src/core/helper/decorators/role.mata.decorator';

@Resolver(() => VendorTransaction)
export class VendorTransactionResolver {
  constructor(
    private readonly vendorTransactionService: VendorTransactionService,
  ) {}

  @Query(() => PaginatedResponse, { name: 'vendorTransactions' })
  @UseGuards(RolesGuard)
  @Roles(RoleEnum.superAdmin)
  findAll(@Args('paginationInput') paginationInput: PaginationInput) {
    return this.vendorTransactionService.findAll(paginationInput);
  }

  @Query(() => PaginatedResponse, { name: 'vendorTransactionsByVendor' })
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

  @Query(() => [VendorTransaction], { name: 'vendorTransactionsByOrder' })
  @UseGuards(RolesGuard)
  @Roles(RoleEnum.superAdmin, RoleEnum.vendor)
  findByOrder(@Args('orderId') orderId: string) {
    return this.vendorTransactionService.findByOrder(orderId);
  }

  @Query(() => VendorTransaction, { name: 'vendorTransaction' })
  @UseGuards(RolesGuard)
  @Roles(RoleEnum.superAdmin, RoleEnum.vendor)
  findOne(@Args('id') id: string) {
    return this.vendorTransactionService.findOne(id);
  }
}
