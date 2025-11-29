import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { VendorOrdersService } from './vendor_orders.service';
import { VendorOrder } from './entities/vendor_order.entity';
import { CreateVendorOrderInput } from './dto/create-vendor_order.input';
import { UpdateVendorOrderInput } from './dto/update-vendor_order.input';

@Resolver(() => VendorOrder)
export class VendorOrdersResolver {
  constructor(private readonly vendorOrdersService: VendorOrdersService) {}

  @Mutation(() => VendorOrder)
  createVendorOrder(@Args('createVendorOrderInput') createVendorOrderInput: CreateVendorOrderInput) {
    return this.vendorOrdersService.create(createVendorOrderInput);
  }

  @Query(() => [VendorOrder], { name: 'vendorOrders' })
  findAll() {
    return this.vendorOrdersService.findAll();
  }

  @Query(() => VendorOrder, { name: 'vendorOrder' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.vendorOrdersService.findOne(id);
  }

  @Mutation(() => VendorOrder)
  updateVendorOrder(@Args('updateVendorOrderInput') updateVendorOrderInput: UpdateVendorOrderInput) {
    return this.vendorOrdersService.update(updateVendorOrderInput.id, updateVendorOrderInput);
  }

  @Mutation(() => VendorOrder)
  removeVendorOrder(@Args('id', { type: () => Int }) id: number) {
    return this.vendorOrdersService.remove(id);
  }
}
