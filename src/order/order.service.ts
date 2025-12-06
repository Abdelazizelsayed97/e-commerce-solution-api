import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateOrderInput } from './dto/create-order.input';
import { UpdateOrderInput } from './dto/update-order.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { CreateOrderResponse } from './dto/create-order-response';
import { paymentMethod } from '../core/enums/payment.method.enum';
import { Cart } from 'src/cart/entities/cart.entity';
import { CartItem } from 'src/cart_item/entities/cart_item.entity';
import { Product } from 'src/product/entities/product.entity';
import { OrderPaymentStatus } from 'src/core/enums/payment.status.enum';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
    @InjectRepository(CartItem)
    private readonly cartItemRepository: Repository<CartItem>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async createOrder(createOrderInput: CreateOrderInput) {

    const cart = await this.cartRepository.findOne({
      where: { id: createOrderInput.cartId },
      relations: ['cartItems', 'cartItems.product', 'cartItems.vendor'],
    });

    if (!cart || !cart.cartItems || cart.cartItems.length === 0) {
      throw new BadRequestException('Cart is empty or does not exist');
    }


    for (const cartItem of cart.cartItems) {
      const product = await this.productRepository.findOne({
        where: { id: cartItem.product.id },
      });
      if (!product) {
        throw new BadRequestException(`Product ${cartItem.product.id} not found`);
      }
      if (product.inStock < cartItem.quantity) {
        throw new BadRequestException(
          `Insufficient stock for product ${product.name}. Available: ${product.inStock}, Requested: ${cartItem.quantity}`,
        );
      }
    }


    const existingOrder = await this.orderRepository.findOne({
      where: { cart: { id: createOrderInput.cartId } },
    });
    if (existingOrder && existingOrder.paymentStatus === OrderPaymentStatus.paid) {
      throw new BadRequestException('Order already exists for this cart');
    }

    const now = Date.now();
    const order = this.orderRepository.create({
      client: { id: createOrderInput.clientId },
      cart: { id: createOrderInput.cartId },
      totalAmount: createOrderInput.totalAmount,
      paymentStatus: OrderPaymentStatus.pending,
      paymentMethod: createOrderInput.paymentMethod,
      shippingAddressId: createOrderInput.shippingAddressId,
      createdAt: now,
      updatedAt: now,
    });

    const savedOrder = await this.orderRepository.save(order);


    const orderItems: OrderItem[] = [];
    for (const cartItem of cart.cartItems) {
      const orderItem = this.orderItemRepository.create({
        order: savedOrder,
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
      throw new BadRequestException('Cannot cancel a paid order. Please request a refund.');
    }


    if (order.orderItems && order.orderItems.length > 0) {
      await this.orderItemRepository.remove(order.orderItems);
    }


    await this.orderRepository.remove(order);
    return { message: 'Order cancelled successfully' };
  }

  async getAllUserOrders(userId: string) {
    return this.orderRepository.find({
      where: { client: { id: userId } },
      relations: ['client', 'orderItems', 'orderItems.product', 'orderItems.vendor', 'cart'],
      order: { createdAt: 'DESC' },
    });
  }

  async getOrderById(id: string) {
    return this.orderRepository.findOne({
      where: { id },
      relations: ['client', 'orderItems', 'orderItems.product', 'orderItems.vendor', 'cart'],
    });
  }

  async updateOrderStatus(orderId: string, status: string) {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
    });
    if (!order) {
      throw new BadRequestException('Order not found');
    }
    order.updatedAt = Date.now();
    return await this.orderRepository.save(order);
  }
}
