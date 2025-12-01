import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { RequestVendorService } from './request_vendor.service';
import { RequestVendor } from './entities/request_vendor.entity';
import { CreateRequestVendorInput } from './dto/create-request_vendor.input';
import { RequestVendorEnum } from 'src/core/enums/request.vendor.status';

@Resolver(() => RequestVendor)
export class RequestVendorResolver {
  constructor(private readonly requestVendorService: RequestVendorService) {}

  @Mutation(() => RequestVendor)
  createRequestVendor(
    @Args('createRequestVendorInput')
    createRequestVendorInput: CreateRequestVendorInput,
  ) {
    return this.requestVendorService.aproveRequestVendor(
      createRequestVendorInput.user_id,
      RequestVendorEnum.pending,
    );
  }
}
