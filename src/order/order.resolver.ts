import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { OrderService } from './order.service';
import { Order } from './entities/order.entity';
import { CreateOrderInput } from './dto/create-order.input';
import { UpdateOrderInput } from './dto/update-order.input';
import { CreateOrderResponse } from './dto/create-order-response';

@Resolver(() => Order)
export class OrderResolver {
  constructor(private readonly orderService: OrderService) {}

  @Mutation(() => Order)
  createOrder(@Args('createOrderInput') createOrderInput: CreateOrderInput) {
    return this.orderService.createOrder(createOrderInput);
  }

  @Query(() => [Order], { name: 'order' })
  findAll(@Args('userId', { type: () => String }) userId: string) {
    return this.orderService.getAllUserOrders(userId);
  }

  @Query(() => Order, { name: 'order' })
  findOne(@Args('orderid', { type: () => String }) id: string) {
    return this.orderService.getOrderById(id);
  }

  @Mutation(() => Order, { name: 'cancelOrder' })
  cancelOrder(@Args('updateOrderInput') updateOrderInput: UpdateOrderInput) {
    return this.orderService.cancelOrder(updateOrderInput);
  }
}
