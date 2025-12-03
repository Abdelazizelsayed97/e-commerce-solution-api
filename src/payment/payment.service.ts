import { Injectable } from '@nestjs/common';
import { CreatePaymentInput } from './dto/create-payment.input';

import stripe from 'stripe';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from 'src/order/entities/order.entity';
import { Repository } from 'typeorm';

const istripe = new stripe(process.env.STRIPE_API_KEY!);

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}
  async createPayment(orderId: string) {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: ['user'],
    });
    if (!order) {
      throw new Error('Order not found');
    }
    const session = await istripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: 'egp',
            unit_amount: Math.floor(order.totalAmount * 100),
            product_data: {
              name: 'New business',
              images: [
                'https://www.bigfootdigital.co.uk/wp-content/uploads/2020/07/image-optimisation-scaled.jpg',
              ],
            },
          },
          price: `${order.totalAmount}`,

          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: 'https://zayedcoffee.com',
      cancel_url: 'https://zayedcoffee.com/login',
      client_reference_id: order.user.id,
      customer_email: order.user.email,
    });
    return session;
  }
}
