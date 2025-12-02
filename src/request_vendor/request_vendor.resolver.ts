import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { RequestVendorService } from './request_vendor.service';
import { RequestVendor } from './entities/request_vendor.entity';
import { CreateRequestVendorInput } from './dto/create-request_vendor.input';
import { PaginationInput } from 'src/core/helper/pagination/paginatoin-input';

@Resolver(() => RequestVendor)
export class RequestVendorResolver {
  constructor(private readonly requestVendorService: RequestVendorService) {}

  @Mutation(() => RequestVendor)
  createRequestVendor(
    @Args('createRequestVendorInput')
    createRequestVendorInput: CreateRequestVendorInput,
  ) {
    return this.requestVendorService.requestBeVendor(createRequestVendorInput);
  }
  @Mutation(() => RequestVendor)
  aproveRequestVendor(@Args('id') id: string) {
    return this.requestVendorService.aproveRequestVendor(id);
  }
  @Mutation(() => RequestVendor)
  rejectRequestVendor(
    @Args('id') id: string,
    @Args('message') message: string,
  ) {
    return this.requestVendorService.rejectRequestVendor(id, message);
  }
  @Mutation(() => [RequestVendor])
  findAll(
    @Args('paginate', { type: () => PaginationInput, nullable: true })
    paginate: PaginationInput,
  ) {
    return this.requestVendorService.findAll(paginate);
  }
}
