import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { RequestVendorService } from './request_vendor.service';
import { RequestVendor } from './entities/request_vendor.entity';
import { CreateRequestVendorInput } from './dto/create-request_vendor.input';
import { PaginatedRequestVendor } from './entities/request.vendor.paginate';
import { PaginationInput } from 'src/core/helper/pagination/paginatoin-input';
import { UseGuards } from '@nestjs/common';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { RoleEnum } from 'src/core/enums/role.enum';
import { Roles } from 'src/core/helper/decorators/role.mata.decorator';
import { AuthGuard } from 'src/user/guard/auth.guard';

@Resolver(() => RequestVendor)
export class RequestVendorResolver {
  constructor(private readonly requestVendorService: RequestVendorService) {}

  @Mutation(() => RequestVendor)
  createRequestVendor(
    @Args('createRequestVendorInput', { type: () => CreateRequestVendorInput })
    createRequestVendorInput: CreateRequestVendorInput,
  ) {
    return this.requestVendorService.requestBeVendor(createRequestVendorInput);
  }
  @Roles(RoleEnum.superAdmin)
  @UseGuards(AuthGuard,RolesGuard)
  @Mutation(() => RequestVendor)
  aproveRequestVendor(@Args('id') id: string) {
    return this.requestVendorService.approveRequestVendor(id);
  }
  @Roles(RoleEnum.superAdmin)
  @UseGuards(RolesGuard)
  @Mutation(() => RequestVendor)
  rejectRequestVendor(
    @Args('id') id: string,
    @Args('message') message: string,
  ) {
    return this.requestVendorService.rejectRequestVendor(id, message);
  }
  @Roles(RoleEnum.superAdmin)
  @UseGuards(RolesGuard)
  @Query(() => PaginatedRequestVendor)
  getAllRequestVendor(
    @Args('paginate')
    paginate: PaginationInput,
  ) {
    console.log('paginate', paginate);
    return this.requestVendorService.findAll(paginate);
  }
}
