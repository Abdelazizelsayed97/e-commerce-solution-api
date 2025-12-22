import {
  Resolver,
  Query,
  Mutation,
  Args,
  Parent,
  ResolveField,
} from '@nestjs/graphql';
import { OrderService } from './order.service';
import { Order } from './entities/order.entity';
import { CreateOrderInput } from './dto/create-order.input';
import { UpdateOrderInput } from './dto/update-order.input';
import { CreateOrderResponse } from './dto/create-order-response';
import { UseGuards } from '@nestjs/common';
import { Roles } from 'src/core/helper/decorators/role.mata.decorator';
import { RoleEnum } from 'src/core/enums/role.enum';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { AuthGuard } from 'src/user/guard/auth.guard';
import { OrderShippingStatusEnum } from 'src/core/enums/order.status.enum';
import { User } from 'src/user/entities/user.entity';
import { Cart } from 'src/cart/entities/cart.entity';
import { CartLoader } from 'src/cart/loaders/cart.loader';
import { PaginationInput } from 'src/core/helper/pagination/paginatoin-input';
import { PaginatedOrder } from './entities/paginated.order';
import { OrderItem } from './entities/order-item.entity';
import { OrderItemLoader } from './loaders/order-item.loader';
import { CurrentUser } from 'src/core/helper/decorators/current.user';
import { Product } from 'src/product/entities/product.entity';
import { Vendor } from 'src/vendor/entities/vendor.entity';
import { VendorLoader } from 'src/vendor/loaders/vendor.loader';
import { ProductLoader } from 'src/product/loader/product.loader';
import { UserLoader } from 'src/user/loader/users.loader';

@Resolver(() => Order)
export class OrderResolver {
  constructor(
    private readonly orderService: OrderService,
    private readonly userLoader: UserLoader,
    private readonly cartLoader: CartLoader,
    private readonly orderItemLoader: OrderItemLoader,
    private readonly productLoader: ProductLoader,
    private readonly vendorLoader: VendorLoader,
  ) {}

  @UseGuards(AuthGuard)
  @Mutation(() => CreateOrderResponse)
  async createOrder(
    @Args('createOrderInput') createOrderInput: CreateOrderInput,
    @CurrentUser() user: User,
  ) {
    const result = await this.orderService.createOrder(createOrderInput, user);
    return result;
  }

  @Query(() => PaginatedOrder, { name: 'userOrders' })
  getUserOrders(
    @Args('userId', { type: () => String }) userId: string,
    @Args('paginate', { type: () => PaginationInput })
    paginate: PaginationInput,
  ) {
    return this.orderService.getAllUserOrders(userId, paginate);
  }

  @Query(() => PaginatedOrder, { name: 'allOrders' })
  @Roles(RoleEnum.superAdmin)
  @UseGuards(AuthGuard, RolesGuard)
  getAllOrders(
    @Args('paginate', { type: () => PaginationInput })
    paginate: PaginationInput,
  ) {
    return this.orderService.getAllOrders(paginate);
  }

  @Query(() => PaginatedOrder, { name: 'vendorOrders' })
  @Roles(RoleEnum.vendor, RoleEnum.superAdmin)
  @UseGuards(AuthGuard, RolesGuard)
  getVendorOrders(
    @Args('vendorId', { type: () => String }) vendorId: string,
    @Args('paginate', { type: () => PaginationInput })
    paginate: PaginationInput,
  ) {
    return this.orderService.getOrdersByVendor(vendorId, paginate);
  }

  @Query(() => Order, { name: 'order' })
  getOrder(@Args('orderId', { type: () => String }) id: string) {
    return this.orderService.getOrderById(id);
  }

  @Mutation(() => Order, { name: 'cancelOrder' })
  @UseGuards(AuthGuard)
  cancelOrder(@Args('updateOrderInput') updateOrderInput: UpdateOrderInput) {
    return this.orderService.cancelOrder(updateOrderInput);
  }

  @Mutation(() => Order, { name: 'updateOrderStatus' })
  @Roles(RoleEnum.vendor, RoleEnum.superAdmin)
  @UseGuards(AuthGuard, RolesGuard)
  updateOrderStatus(
    @Args('orderId', { type: () => String }) orderId: string,
    @Args('status', { type: () => OrderShippingStatusEnum })
    status: OrderShippingStatusEnum,
  ) {
    return this.orderService.updateOrderStatus(orderId, status);
  }
  @ResolveField(() => User)
  client(@Parent() order: Order) {
    if (!order.userId) return null;
    return this.userLoader.loader().load(order.userId);
  }

  @ResolveField(() => Cart)
  cart(@Parent() order: Order) {
    if (!order.cartId) return null;
    return this.cartLoader.loader().load(order.cartId);
  }

  @ResolveField(() => [OrderItem], { nullable: true })
  async orderItems(@Parent() order: Order) {
    if (!order.orderItems) return null;
    return this.orderItemLoader
      .loader()
      .loadMany(order.orderItems.map((map) => map.id));
  }
  @ResolveField(() => Product)
  product(@Parent() orderItem: OrderItem) {
    if (!orderItem.product) return null;
    return this.productLoader.loader().load(orderItem.product.id);
  }
  @ResolveField(() => Vendor)
  vendor(@Parent() orderItem: OrderItem) {
    if (!orderItem.vendor) return null;
    return this.vendorLoader.loader().load(orderItem.vendor.id);
  }
}
