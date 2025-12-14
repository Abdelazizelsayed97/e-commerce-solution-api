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
  ) {
    this.stripeInstance = new stripe(process.env.STRIPE_API_KEY!);
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
                (oi) =>
                  oi.product.id === cartItem.product.id &&
                  oi.vendor.id === cartItem.vendor?.id,
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
          //this part is for vendor transactions after payment success

          const userTransaction = this.transactionRepository.create({
            type: TransactionTypeEnum.ORDER_INCOME,
            amount: order.totalAmount,
            balanceAfter: userWallet?.balance || 0,
            order: order,
            user: order.client,
            description: `Payment received for order ${orderId}`,
            createdAt: new Date(),
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
              createdAt: new Date(),
              updatedAt: new Date(),
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
              product: product,
              order: order,
              quantityChanged: item.quantity,
              previousStock: previousStock,
              newStock: product.inStock,
              action: stockHistoryActionEnum.REFUNDED,
              reason: 'Payment cancelled/expired',
              createdAt: new Date(),
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
      product: product,
      order: orderItem.order,
      quantityChanged: orderItem.quantity,
      previousStock: previousStock,
      newStock: product.inStock,
      action: action as any,
      reason: `${action} from order`,
      createdAt: new Date(),
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
        order: order,
        user: order.client,
        description: `${transactionType}: ${error}`,
        createdAt: new Date(),
      });
    }
  }

  async handleRefundTransactions(rawBody: Buffer, signature: string) {
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!endpointSecret) {
      throw new Error('Stripe webhook secret not configured');
    }
    let event: stripe.Event;

    try {
      const refund = await this.stripeInstance.refunds.create({
        charge: 'charge_id',
        reverse_transfer: true,
        refund_application_fee: true,
        metadata: {
          order_id: 'order_id',
          vendor_id: 'vendor_id',
          transaction_id: 'transaction_id',
        },
      });
      event = stripe.webhooks.constructEvent(
        rawBody,
        signature,
        endpointSecret,
      );
    } catch (err) {
      throw new Error('Webhook signature verification failed');
    }

    if (event.type === 'refund.updated') {
      const refund = event.data.object as stripe.Refund;
      await this.handleRefund(refund);
    }
  }

  async handleRefund(refund: stripe.Refund) {
    // refund transactions

    const transaction = await this.transactionRepository.findOne({
      where: { order: { id: refund.metadata?.transaction_id } },
    });
    if (!transaction) {
      throw new Error('Transaction not found');
    }
    transaction.type = TransactionTypeEnum.REFUND;
    transaction.amount = refund.amount;
    transaction.balanceAfter = transaction.balanceAfter - refund.amount;
    await this.transactionRepository.save(transaction);
    // update order status
    const order = await this.orderRepository.findOne({
      where: { id: refund.metadata?.order_id },
    });
    if (!order) {
      throw new Error('Order not found');
    }
    order.paymentStatus = OrderPaymentStatus.refunded;
    await this.orderRepository.save(order);
    // update stock
    // update vendor balance
    // update user balance if the option is transfer to wallet not to source
  }
}
