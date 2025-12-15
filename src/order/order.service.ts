import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateOrderInput } from './dto/create-order.input';
import { UpdateOrderInput } from './dto/update-order.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';

import { Cart } from 'src/cart/entities/cart.entity';

import { Product } from 'src/product/entities/product.entity';
import { OrderPaymentStatus } from 'src/core/enums/payment.status.enum';
import { OrderShippingStatusEnum } from 'src/core/enums/order.status.enum';
import { PaginationInput } from 'src/core/helper/pagination/paginatoin-input';
import { PaginatedOrder } from './entities/paginated.order';
import { User } from 'src/user/entities/user.entity';
import { QueueService } from 'src/queue/queue.service';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly queueService: QueueService,
  ) {}

  async createOrder(createOrderInput: CreateOrderInput, user: User) {
    const cart = await this.cartRepository.findOne({
      where: { id: createOrderInput.cartId },
      relations: ['cartItems', 'cartItems.product', 'cartItems.vendor'],
    });

    if (!cart || !cart.cartItems || cart.cartItems.length === 0) {
      throw new BadRequestException('Cart is empty or does not exist');
    }
    let totalAmount = 0;

    for (const cartItem of cart.cartItems) {
      totalAmount += cartItem.totlePrice;
      const product = await this.productRepository.findOne({
        where: { id: cartItem.product.id },
      });
      if (!product) {
        throw new BadRequestException(
          `Product ${cartItem.product.id} not found`,
        );
      }
      if (product.inStock < cartItem.quantity) {
        throw new BadRequestException(
          `Insufficient stock for product ${product.name}. Available: ${product.inStock}, Requested: ${cartItem.quantity}`,
        );
      }
    }

    // const existingOrder = await this.orderRepository.findOne({
    //   where: { cart: { id: createOrderInput.cartId } },
    // });
    // if (existingOrder && existingOrder.paymentStatus === OrderPaymentStatus.paid) {
    //   throw new BadRequestException('Order already exists for this cart');
    // }

    const now = Date.now();
    console.log('useruseruser', user);
    const order = this.orderRepository.create({
      client: user,
      cart: { id: createOrderInput.cartId },
      totalAmount: totalAmount,
      paymentStatus: OrderPaymentStatus.pending,
      paymentMethod: createOrderInput.paymentMethod,
      shippingAddressId: createOrderInput.shippingAddressId,
      status: OrderShippingStatusEnum.PENDING,
      createdAt: now,
      updatedAt: now,
    });

    const savedOrder = await this.orderRepository.save(order);

    const orderItems: OrderItem[] = [];
    for (const cartItem of cart.cartItems) {
      const orderItem = this.orderItemRepository.create({
        // order: savedOrder,
        product: cartItem.product,
        vendor: cartItem.vendor,
        quantity: cartItem.quantity,
        unitPrice: cartItem.product.price,
        totalPrice: cartItem.totlePrice,
        status: 'pending',
      });
      orderItems.push(orderItem);
    }

    await this.orderItemRepository.save(orderItems);
    savedOrder.orderItems = orderItems;

    return savedOrder;
  }

  async cancelOrder(updateOrderInput: UpdateOrderInput) {
    const order = await this.orderRepository.findOne({
      where: { id: updateOrderInput.id },
      relations: ['orderItems', 'orderItems.product'],
    });
    if (!order) {
      throw new BadRequestException('Order not found');
    }

    if (order.paymentStatus === OrderPaymentStatus.paid) {
      throw new BadRequestException(
        'Cannot cancel a paid order. Please request a refund.',
      );
    }

    if (order.orderItems && order.orderItems.length > 0) {
      await this.orderItemRepository.remove(order.orderItems);
    }

    await this.orderRepository.remove(order);
    return { message: 'Order cancelled successfully' };
  }

  async getAllUserOrders(
    userId: string,
    paginate: PaginationInput,
  ): Promise<PaginatedOrder> {
    const skip = (paginate.page - 1) * paginate.limit;

    const [orders, totalItems] = await this.orderRepository.findAndCount({
      where: { client: { id: userId } },
      relations: [
        'client',
        'orderItems',
        'orderItems.product',
        'orderItems.vendor',
        'cart',
      ],
      order: { createdAt: 'DESC' },
      skip,
      take: paginate.limit,
    });
    return {
      items: orders,
      pagination: {
        totalItems,
        itemCount: orders.length,
        itemsPerPage: paginate.limit,
        totalPages: Math.ceil(totalItems / paginate.limit),
        currentPage: paginate.page,
      },
    };
  }

  async getOrderById(id: string) {
    return this.orderRepository.findOne({
      where: { id },
      relations: [
        'client',
        'orderItems',
        'orderItems.product',
        'orderItems.vendor',
        'cart',
      ],
    });
  }

  async updateOrderStatus(orderId: string, status: OrderShippingStatusEnum) {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: ['client'],
    });
    if (!order) {
      throw new BadRequestException('Order not found');
    }

    const oldStatus = order.status;
    const now = Date.now();
    order.status = status;
    order.updatedAt = now;

    const updatedOrder = await this.orderRepository.save(order);

    // Send email notification for status change
    if (oldStatus !== status && order.client) {
      await this.queueService.addEmail('statusNotification', {
        user: {
          name: order.client.name,
          email: order.client.email,
        },
        entityName: 'Order',
        oldStatus: oldStatus,
        newStatus: status,
        orderId: order.id,
      });
    }

    return updatedOrder;
  }

  async getAllOrders(paginate: PaginationInput): Promise<PaginatedOrder> {
    const skip = (paginate.page - 1) * paginate.limit;
    const [orders, totalItems] = await this.orderRepository.findAndCount({
      relations: [
        'client',
        'orderItems',
        'orderItems.product',
        'orderItems.vendor',
        'cart',
      ],
      order: { createdAt: 'DESC' },
      skip,
      take: paginate.limit,
    });
    return {
      items: orders,
      pagination: {
        currentPage: paginate.page,
        totalItems,
        itemCount: orders.length,
        itemsPerPage: paginate.limit,
        totalPages: Math.ceil(totalItems / paginate.limit),
      },
    };
  }

  async getOrdersByVendor(
    vendorId: string,
    paginate: PaginationInput,
  ): Promise<PaginatedOrder> {
    const skip = (paginate.page - 1) * paginate.limit;
    const [orders, totalItems] = await this.orderRepository.findAndCount({
      where: { orderItems: { vendor: { id: vendorId } } },
      relations: [
        'client',
        'orderItems',
        'orderItems.product',
        'orderItems.vendor',
        'cart',
      ],
      order: { createdAt: 'DESC' },
      skip,
      take: paginate.limit,
    });
    return {
      items: orders,
      pagination: {
        currentPage: paginate.page,
        totalItems,
        itemCount: orders.length,
        itemsPerPage: paginate.limit,
        totalPages: Math.ceil(totalItems / paginate.limit),
      },
    };
  }
}
