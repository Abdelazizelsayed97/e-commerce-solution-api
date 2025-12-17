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
import { VendorPaginated } from './entities/vendor.paginated';
import { CreateVendorInput } from './dto/create-vendor.input';
import { UpdateVendorInput } from './dto/update-vendor.input';
import { PaginationInput } from 'src/core/helper/pagination/paginatoin-input';
import DataLoader from 'dataloader';
import { DataSource } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { UserLoader } from 'src/user/loader/users.loader';
import { VendorLoader } from './loaders/vendor.loader';

@Resolver(() => Vendor)
export class VendorResolver {
  vendorLoader: DataLoader<string, Vendor | null>;
  userLoader: DataLoader<string, User | null>;

  constructor(
    private readonly vendorService: VendorService,
    dataSource: DataSource,
  ) {
    this.userLoader = UserLoader(dataSource.getRepository(User));
    this.vendorLoader = VendorLoader(dataSource.getRepository(Vendor));
  }

  @Mutation(() => Vendor)
  createVendor(
    @Args('createVendorInput') createVendorInput: CreateVendorInput,
  ) {
    return this.vendorService.create(createVendorInput);
  }

  @Query(() => VendorPaginated, { name: 'vendors' })
  vendors(@Args('paginate') paginate: PaginationInput) {
    return this.vendorService.getAllVendors(paginate);
  }

  @Query(() => Vendor, { name: 'vendor' })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.vendorService.findOne(id);
  }

  //Most popular vendors (by rating + number of purchases)

  @Query(() => [Vendor], { name: 'mostPopularVendors' })
  async getMostPopularVendors(
    @Args('paginate', { nullable: true }) paginate: PaginationInput,
  ) {
    return this.vendorService.getMostPopularVendors(paginate);
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
    if (!vendor.user) return null;

    return this.userLoader.load(vendor.user.id);
  }
}
