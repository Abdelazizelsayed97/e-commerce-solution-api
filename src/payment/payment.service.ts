import { Injectable, Post } from '@nestjs/common';
import { CreatePaymentInput } from './dto/create-payment.input';

import stripe from 'stripe';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from 'src/order/entities/order.entity';
import { Repository } from 'typeorm';
import { OrderPaymentStatus } from 'src/core/enums/payment.status.enum';

const stripeInstance = new stripe(process.env.STRIPE_API_KEY!);

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
    const session = await stripeInstance.checkout.sessions.create({
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
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: 'https://zayedcoffee.com',
      cancel_url: 'https://zayedcoffee.com/login',
      client_reference_id: order.client.id,
      customer_email: order.client.email,
    });
    return session;
  }

  @Post('webhook')
  async verifyAndHandleWebhook(rawBody: Buffer, signature: string) {
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!endpointSecret) {
      throw new Error('Stripe webhook secret not configured');
    }

    let event: stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        rawBody,
        signature,
        endpointSecret,
      );
    } catch (err) {
      console.log(`Webhook signature verification failed.`, err.message);
      throw new Error('Webhook signature verification failed');
    }

    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object as stripe.Checkout.Session;
        console.log(`Payment for session ${session.id} was successful!`);

        await this.handlePaymentSuccess(session);
        break;
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object as stripe.PaymentIntent;
        console.log(
          `PaymentIntent for ${paymentIntent.amount} was successful!`,
        );
        break;
      case 'payment_method.attached':
        const paymentMethod = event.data.object as stripe.PaymentMethod;
        console.log(`PaymentMethod ${paymentMethod.id} was attached.`);
        break;
      default:
        console.log(`Unhandled event type ${event.type}.`);
    }
  }

  private async handlePaymentSuccess(session: stripe.Checkout.Session) {
    const orderId = session.client_reference_id;
    if (orderId) {
      const order = await this.orderRepository.findOne({
        where: { id: orderId },
      });
      if (order) {
        order.paymentStatus = OrderPaymentStatus.paid;
        await this.orderRepository.save(order);
        console.log(`Order ${orderId} payment status updated to paid.`);
      }
    }
  }
}
