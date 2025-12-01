import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { VendorService } from './vendor.service';
import { Vendor } from './entities/vendor.entity';
import { CreateVendorInput } from './dto/create-vendor.input';
import { UpdateVendorInput } from './dto/update-vendor.input';
import { DataSource } from 'typeorm';
import { User } from 'src/user/entities/user.entity';

@Resolver(() => Vendor)
export class VendorResolver {
  constructor(
    private readonly vendorService: VendorService,
    private readonly dataSource: DataSource,
  ) {}

  @Mutation(() => Vendor)
  createVendor(
    @Args('createVendorInput') createVendorInput: CreateVendorInput,
  ) {
    return this.vendorService.create(createVendorInput);
  }

  @Query(() => [Vendor], { name: 'vendors' })
  findAll() {
    return this.vendorService.getAllVendors();
  }

  @Query(() => Vendor, { name: 'vendor' })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.vendorService.findOne(id);
  }

  @Mutation(() => Vendor)
  updateVendor(
    @Args('updateVendorInput') updateVendorInput: UpdateVendorInput,
  ) {
    return this.vendorService.update(updateVendorInput.id, updateVendorInput);
  }

  @Mutation(() => Vendor)
  removeVendor(@Args('id', { type: () => Int }) id: number) {
    return this.vendorService.remove(id);
  }
  @ResolveField(() => User)
  user(@Parent() vendor: Vendor) {
    return this.vendorService.findOne(vendor.id);
  }
}
