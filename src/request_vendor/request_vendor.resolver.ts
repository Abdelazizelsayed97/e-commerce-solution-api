import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { RequestVendorService } from './request_vendor.service';
import { RequestVendor } from './entities/request_vendor.entity';
import { CreateRequestVendorInput } from './dto/create-request_vendor.input';
import { PaginatedRequestVendor } from './entities/request.vendor.paginate';
import { PaginationInput } from 'src/core/helper/pagination/paginatoin-input';

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
  @Mutation(() => RequestVendor)
  aproveRequestVendor(@Args('id') id: string) {
    return this.requestVendorService.approveRequestVendor(id);
  }
  @Mutation(() => RequestVendor)
  rejectRequestVendor(
    @Args('id') id: string,
    @Args('message') message: string,
  ) {
    return this.requestVendorService.rejectRequestVendor(id, message);
  }

  @Query(() => PaginatedRequestVendor)
  getAllRequestVendor(
    @Args('paginate')
    paginate: PaginationInput,
  ) {
    console.log('paginate', paginate);
    return this.requestVendorService.findAll(paginate);
  }
}
