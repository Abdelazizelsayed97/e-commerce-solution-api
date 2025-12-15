import { Injectable, Post } from '@nestjs/common';

import stripe from 'stripe';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from 'src/order/entities/order.entity';
import { Repository } from 'typeorm';
import { OrderPaymentStatus } from 'src/core/enums/payment.status.enum';
import { Transaction } from 'src/transaction/entities/transaction.entity';
import { VendorTransaction } from 'src/transaction/entities/vendor-transaction.entity';
import { StockHistory } from 'src/product/entities/stock-history.entity';
import { Product } from 'src/product/entities/product.entity';
import { OrderItem } from 'src/order/entities/order-item.entity';
import { Vendor } from 'src/vendor/entities/vendor.entity';
import { Wallet } from 'src/wallet/entities/wallet.entity';
import { TransactionTypeEnum } from 'src/core/enums/transaction.enum';
import { CartItemService } from 'src/cart_item/cart_item.service';
import { stockHistoryActionEnum } from 'src/core/enums/stock.history.enum';
import { OrderPaymentVendorStatusEnum } from 'src/core/enums/order.payment.status';
import { CartItem } from 'src/cart_item/entities/cart_item.entity';
import { OrderShippingStatusEnum } from 'src/core/enums/order.status.enum';
import { QueueService } from 'src/queue/queue.service';
import { User } from 'src/user/entities/user.entity';
import { RefundReason } from 'src/core/enums/refund.reason.enum';

@Injectable()
export class PaymentService {
  private stripeInstance: stripe;
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    @InjectRepository(VendorTransaction)
    private readonly vendorTransactionRepository: Repository<VendorTransaction>,
    @InjectRepository(StockHistory)
    private readonly stockHistoryRepository: Repository<StockHistory>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Wallet)
    private readonly walletRepository: Repository<Wallet>,
    @InjectRepository(Vendor)
    private readonly vendorRepository: Repository<Vendor>,
    private cartItemService: CartItemService,

    private queueService: QueueService,
  ) {
    this.stripeInstance = new stripe(process.env.STRIPE_API_KEY!);
  }

  async processRefund(orderId: string, reason?: RefundReason) {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: [
        'client',
        'orderItems',
        'orderItems.product',
        'orderItems.vendor',
      ],
    });

    if (!order) {
      throw new Error('Order not found');
    }

    if (order.paymentStatus !== OrderPaymentStatus.paid) {
      throw new Error('Only paid orders can be refunded');
    }

    if (order.status === OrderShippingStatusEnum.CANCELLED) {
      throw new Error('Order has already been cancelled or refunded');
    }

    try {
      // Process Stripe refund if payment was made via Stripe
      if (order.transactionId) {
        await this.stripeInstance.refunds.create({
          payment_intent: order.transactionId,
          reason: 'requested_by_customer',
        });
      }

      // Create refund transaction for client
      const clientWallet = await this.walletRepository.findOne({
        where: { user: { id: order.client.id } },
      });

      if (!clientWallet) {
        throw new Error('Client wallet not found');
      }

      const refundTransaction = this.transactionRepository.create({
        type: TransactionTypeEnum.REFUND,
        amount: order.totalAmount,
        balanceAfter: clientWallet.balance + order.totalAmount,
        description: `Refund for order ${order.id}${reason ? ` - ${reason}` : ''}`,
        user: order.client,
        order,
        wallet: clientWallet,
      });

      await this.transactionRepository.save(refundTransaction);

      // Update client wallet balance
      clientWallet.balance += order.totalAmount;
      await this.walletRepository.save(clientWallet);

      // Restore product stock
      for (const orderItem of order.orderItems as OrderItem[]) {
        const product = await this.productRepository.findOne({
          where: { id: orderItem.product.id },
          relations: {
            vendor: true,
          },
        });

        if (product) {
          product.inStock += orderItem.quantity;
          await this.productRepository.save(product);

          // Record stock history
          const stockHistory = this.stockHistoryRepository.create({
            action: stockHistoryActionEnum.REFUNDED,
            quantityChanged: orderItem.quantity,
            reason: `Refund for order ${order.id}`,
            order,
            previousStock: product.inStock - orderItem.quantity,
            newStock: product.inStock,
            product_id: product.id,
            product,
          });
          await this.stockHistoryRepository.save(stockHistory);
        }
      }

      // Update order status to refunded
      order.paymentStatus = OrderPaymentStatus.refunded;
      order.status = OrderShippingStatusEnum.CANCELLED;
      order.updatedAt = Date.now();
      await this.orderRepository.save(order);

      // Send refund notification email
      await this.queueService.addEmail('statusNotification', {
        user: {
          name: order.client.name,
          email: order.client.email,
        },
        entityName: 'Order Refund',
        oldStatus: 'PAID',
        newStatus: 'REFUNDED',
        orderId: order.id,
      });

      return {
        success: true,
        message: 'Refund processed successfully',
        refundAmount: order.totalAmount,
      };
    } catch (error) {
      throw new Error(`Failed to process refund: ${error.message}`);
    }
  }

  async createRefundRequest(orderId: string, reason: RefundReason, user: User) {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: ['client'],
    });

    if (!order) {
      throw new Error('Order not found');
    }

    if (order.client.id !== user.id) {
      throw new Error('You can only request refunds for your own orders');
    }

    if (order.paymentStatus !== OrderPaymentStatus.paid) {
      throw new Error('Only paid orders can be refunded');
    }

    if (order.status === OrderShippingStatusEnum.CANCELLED) {
      throw new Error('Order has already been refunded');
    }

    // Create refund request record (you might want to create a separate entity for this)
    const refundRequest = {
      orderId,
      userId: user.id,
      reason,
      status: 'PENDING',
      createdAt: Date.now(),
    };

    // In a real implementation, you would save this to a refund_requests table
    // and notify admins for approval

    return {
      success: true,
      message: 'Refund request submitted successfully',
      request: refundRequest,
    };
  }

  async createPayment(orderID: string) {
    const order = await this.orderRepository.findOne({
      where: { id: orderID },
      relations: {
        client: true,
        cart: true,
      },
    });
    console.log('order', order?.client);
    if (!order) {
      throw new Error('Order not found');
    }

    const session = await this.stripeInstance.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: 'egp',
            unit_amount: Math.floor(order.totalAmount * 100),
            product_data: {
              name: 'Order #' + orderID,
              images: [
                'https://www.bigfootdigital.co.uk/wp-content/uploads/2020/07/image-optimisation-scaled.jpg',
              ],
            },
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL || 'https://localhost:3000'}/order/${order.id}/success`,
      cancel_url: `${process.env.FRONTEND_URL || 'https://localhost:3000'}/order/${order.id}/cancel`,
      client_reference_id: order.id,
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
      throw new Error('Webhook signature verification failed');
    }

    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object as stripe.Checkout.Session;

        await this.handlePaymentSuccess(session);
        break;
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object as stripe.PaymentIntent;
        // await this.handlePaymentSuccess(paymentIntent);
        break;
      case 'checkout.session.expired':
        const expiredSession = event.data.object as stripe.Checkout.Session;
        await this.handlePaymentFailed(expiredSession);
        break;
      default:
    }
  }

  private async handlePaymentSuccess(session: stripe.Checkout.Session) {
    const orderId = session.client_reference_id;
    if (orderId) {
      const order = await this.orderRepository.findOne({
        where: { id: orderId },
        relations: [
          'client',
          'orderItems',
          'orderItems.product',
          'orderItems.vendor',
          'cart',
          'cart.cartItems',
          'cart.cartItems.product',
          'cart.cartItems.vendor',
        ],
      });
      if (order) {
        try {
          order.paymentStatus = OrderPaymentStatus.paid;
          order.transactionId = session.id;
          order.updatedAt = Date.now();
          await this.orderRepository.save(order);

          for (const item of order.orderItems || []) {
            await this.updateStockAndHistory(item, 'sold');
          }

          if (order.cart && order.cart.cartItems) {
            for (const cartItem of order.cart.cartItems) {
              const orderItem = (order.orderItems || []).find(
                (oi) => oi.product.id === cartItem.product.id,
              );
              if (orderItem) {
                const newQuantity = cartItem.quantity - orderItem.quantity;
                if (newQuantity <= 0) {
                  await this.cartItemService.remove(cartItem.id);
                } else {
                  cartItem.quantity = newQuantity;
                  cartItem.totlePrice = newQuantity * cartItem.product.price;

                  const cartItemRepo =
                    this.orderRepository.manager.getRepository(CartItem);
                  await cartItemRepo.save(cartItem);
                }
              }
            }
          }

          const userWallet = await this.walletRepository.findOne({
            where: { user: { id: order.client.id } },
          });
          if (!userWallet) {
            const userWallet = this.walletRepository.create({
              user: { id: order.client.id },
            });
            await this.walletRepository.save(userWallet);
          }
          console.log('userWallet', userWallet);
          if (userWallet) {
            userWallet.balance += order.totalAmount;
            await this.walletRepository.save(userWallet);
          }
          //this part is for vendor transactions after payment success

          const userTransaction = this.transactionRepository.create({
            type: TransactionTypeEnum.ORDER_INCOME,
            amount: order.totalAmount,
            balanceAfter: userWallet?.balance || 0,
            order_id: order.id,
            user_id: order.client.id,
            wallet_id: userWallet?.id,
            description: `Payment received for order ${orderId}`,
          });
          await this.transactionRepository.save(userTransaction);

          const vendorMap = new Map();
          for (const item of order.orderItems || []) {
            if (!vendorMap.has(item.vendor.id)) {
              vendorMap.set(item.vendor.id, []);
            }
            vendorMap.get(item.vendor.id).push(item);
          }

          for (const [vendorId, items] of vendorMap) {
            const vendor = await this.vendorRepository.findOne({
              where: { id: vendorId },
            });
            if (!vendor) {
              continue;
            }

            const commission = order.totalAmount * 0.1;
            const vendorAmount = order.totalAmount - commission;

            //this part is for vendor transactions after adjusting the commission
            const commissionTx = this.vendorTransactionRepository.create({
              vendor: vendor,
              order: order,
              type: TransactionTypeEnum.MARKETPLACE_COMMISSION,
              amount: commission,
              status: OrderPaymentStatus.paid,
              description: `Commission (10%) for order ${orderId}`,
            });
            await this.vendorTransactionRepository.save(commissionTx);

            vendor.balance += vendorAmount;
            await this.vendorRepository.save(vendor);
          }
        } catch (error) {
          console.error(
            `Error processing payment success for order ${orderId}:`,
            error,
          );

          await this.logFailedTransaction(
            orderId,
            OrderPaymentVendorStatusEnum.PAYMENT_PROCESSING_FAILED,
            error.message,
          );
          throw error;
        }
      }
    }
  }

  private async handlePaymentFailed(session: stripe.Checkout.Session) {
    const orderId = session.client_reference_id;
    if (orderId) {
      const order = await this.orderRepository.findOne({
        where: { id: orderId },
        relations: ['client', 'orderItems', 'orderItems.product'],
      });
      if (order) {
        try {
          order.paymentStatus = OrderPaymentStatus.pending;
          order.updatedAt = Date.now();
          await this.orderRepository.save(order);

          for (const item of order.orderItems || []) {
            const product = item.product;
            const previousStock = product.inStock;
            product.inStock += item.quantity;

            await this.stockHistoryRepository.save({
              product_id: product.id,
              order_id: order.id,
              quantityChanged: item.quantity,
              previousStock: previousStock,
              newStock: product.inStock,
              action: stockHistoryActionEnum.REFUNDED,
              reason: 'Payment cancelled/expired',
              createdAt: Date.now(),
            });

            await this.productRepository.save(product);
          }

          await this.logFailedTransaction(
            orderId,
            OrderPaymentVendorStatusEnum.PAYMENT_FAILED,
            'Payment session expired or cancelled',
          );
        } catch (error) {
          console.error(
            `Error processing payment failure for order ${orderId}:`,
            error,
          );
          throw error;
        }
      }
    }
  }

  private async updateStockAndHistory(orderItem: OrderItem, action: string) {
    const product = orderItem.product;
    const previousStock = product.inStock;
    product.inStock -= orderItem.quantity;

    if (product.inStock < 0) {
      throw new Error(`Insufficient stock for product ${product.id}`);
    }

    await this.productRepository.save(product);

    await this.stockHistoryRepository.save({
      product_id: orderItem.product.id,
      order_id: orderItem.order.id,
      quantityChanged: orderItem.quantity,
      previousStock: previousStock,
      newStock: product.inStock,
      action: stockHistoryActionEnum[action.toUpperCase()],
      reason: `${action} from order`,
      createdAt: Date.now(),
    });
  }

  private async logFailedTransaction(
    orderId: string,
    transactionType: OrderPaymentVendorStatusEnum,
    error: string,
  ) {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: {
        client: true,
      },
    });

    //this part is for vendor transactions after payment failure
    if (order) {
      await this.transactionRepository.save({
        type: TransactionTypeEnum.ADJUSTMENT,
        amount: 0,
        balanceAfter: 0,
        order_id: order.id,
        user_id: order.client.id,
        description: `${transactionType}: ${error}`,
        createdAt: Date.now(),
      });
    }
  }
}
