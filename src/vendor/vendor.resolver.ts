import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { VendorService } from './vendor.service';
import { Vendor } from './entities/vendor.entity';
import { CreateVendorInput } from './dto/create-vendor.input';
import { UpdateVendorInput } from './dto/update-vendor.input';

@Resolver(() => Vendor)
export class VendorResolver {
  constructor(private readonly vendorService: VendorService) {}

  @Mutation(() => Vendor)
  createVendor(@Args('createVendorInput') createVendorInput: CreateVendorInput) {
    return this.vendorService.create(createVendorInput);
  }

  @Query(() => [Vendor], { name: 'vendor' })
  findAll() {
    return this.vendorService.findAll();
  }

  @Query(() => Vendor, { name: 'vendor' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.vendorService.findOne(id);
  }

  @Mutation(() => Vendor)
  updateVendor(@Args('updateVendorInput') updateVendorInput: UpdateVendorInput) {
    return this.vendorService.update(updateVendorInput.id, updateVendorInput);
  }

  @Mutation(() => Vendor)
  removeVendor(@Args('id', { type: () => Int }) id: number) {
    return this.vendorService.remove(id);
  }
}
