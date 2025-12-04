import { Injectable } from '@nestjs/common';
import { CreateOrderInput } from './dto/create-order.input';
import { UpdateOrderInput } from './dto/update-order.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { PaymentService } from '../payment/payment.service';
import { CreateOrderResponse } from './dto/create-order-response';
import { paymentMethod } from '../core/enums/payment.method.enum';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    private readonly paymentService: PaymentService,
  ) {}
  async createOrder(createOrderInput: CreateOrderInput) {
    const isExist = await this.orderRepository.findOne({
      where: { ...createOrderInput },
    });
    if (isExist) {
      throw new Error('order already exist');
    }
    const order = this.orderRepository.create({
      ...createOrderInput,
    });
    return await this.orderRepository.save(order);
  }

  cancelOrder(updateOrderInput: UpdateOrderInput) {}
  getAllUserOrders(userId: string) {}
  getOrderById(id: string) {}
}
