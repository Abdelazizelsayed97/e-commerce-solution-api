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
import { PaymentService } from 'src/payment/payment.service';
import { Roles } from 'src/core/helper/decorators/role.mata.decorator';
import { RoleEnum } from 'src/core/enums/role.enum';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { AuthGuard } from 'src/user/guard/auth.guard';
import { OrderShippingStatusEnum } from 'src/core/enums/order.status.enum';
import { User } from 'src/user/entities/user.entity';
import DataLoader from 'dataloader';
import { DataSource } from 'typeorm';
import { OrderLoader } from './loaders/order.loader';
import { UserLoader } from 'src/user/loader/users.loader';
import { Cart } from 'src/cart/entities/cart.entity';
import { cartLoader } from 'src/cart/loaders/cart.loader';

@Resolver(() => Order)
export class OrderResolver {
  orderLoader: DataLoader<string, Order>;
  userLoader: DataLoader<string, User>;
  cartLoader: DataLoader<string, Cart>;
  constructor(
    private dataSource: DataSource,
    private readonly orderService: OrderService,
    private readonly paymentService?: PaymentService,
  ) {
    this.orderLoader = OrderLoader(dataSource.getRepository(Order));
    this.userLoader = UserLoader(dataSource.getRepository(User));
    this.cartLoader = cartLoader(dataSource);
  }

  @Mutation(() => CreateOrderResponse)
  async createOrder(
    @Args('createOrderInput') createOrderInput: CreateOrderInput,
  ) {
    const order = await this.orderService.createOrder(createOrderInput);
    let paymentUrl: string | undefined;
    try {
      if (this.paymentService) {
        console.log('Creating payment session...');
        const session = await this.paymentService.createPayment(order.id);
        paymentUrl = session.url || undefined;
      }
    } catch (error) {
      console.error('Error creating payment session:', error);
    }
    return {
      order,
      paymentUrl,
    };
  }

  @Query(() => [Order], { name: 'userOrders' })
  getUserOrders(@Args('userId', { type: () => String }) userId: string) {
    return this.orderService.getAllUserOrders(userId);
  }

  @Query(() => [Order], { name: 'allOrders' })
  @Roles(RoleEnum.superAdmin)
  @UseGuards(AuthGuard, RolesGuard)
  getAllOrders() {
    return this.orderService.getAllOrders();
  }

  @Query(() => [Order], { name: 'vendorOrders' })
  @Roles(RoleEnum.vendor, RoleEnum.superAdmin)
  @UseGuards(AuthGuard, RolesGuard)
  getVendorOrders(@Args('vendorId', { type: () => String }) vendorId: string) {
    return this.orderService.getOrdersByVendor(vendorId);
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
  client(@Parent() order) {
    console.log('userLoader', order);
    return this.userLoader.load(order.clientId);
  }
  @ResolveField(() => Order)
  order(@Parent() order) {
    console.log('orderLoader', order);
    return this.orderLoader.load(order.id);
  }
  @ResolveField(() => Cart)
  cart(@Parent() order) {
    console.log('cartLoader', order);
    return this.cartLoader.load(order.cartId);
  }
}
