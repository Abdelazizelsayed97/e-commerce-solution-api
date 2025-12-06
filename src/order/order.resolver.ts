import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { OrderService } from './order.service';
import { Order } from './entities/order.entity';
import { CreateOrderInput } from './dto/create-order.input';
import { UpdateOrderInput } from './dto/update-order.input';
import { CreateOrderResponse } from './dto/create-order-response';
import { Inject } from '@nestjs/common';
import { PaymentService } from 'src/payment/payment.service';

@Resolver(() => Order)
export class OrderResolver {
  constructor(
    private readonly orderService: OrderService,
    @Inject('PAYMENT_SERVICE') private readonly paymentService?: PaymentService,
  ) {}

  @Mutation(() => CreateOrderResponse)
  async createOrder(
    @Args('createOrderInput') createOrderInput: CreateOrderInput,
  ) {
    const order = await this.orderService.createOrder(createOrderInput);
    let paymentUrl: string | undefined;

    try {
      if (this.paymentService) {
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

  @Query(() => Order, { name: 'order' })
  getOrder(@Args('orderId', { type: () => String }) id: string) {
    return this.orderService.getOrderById(id);
  }

  @Mutation(() => Order, { name: 'cancelOrder' })
  cancelOrder(
    @Args('updateOrderInput') updateOrderInput: UpdateOrderInput,
  ) {
    return this.orderService.cancelOrder(updateOrderInput);
  }
}
