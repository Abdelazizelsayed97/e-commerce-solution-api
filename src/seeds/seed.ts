import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { User } from '../user/entities/user.entity';
import { Vendor } from '../vendor/entities/vendor.entity';
import { Product } from '../product/entities/product.entity';
import { Cart } from '../cart/entities/cart.entity';
import { CartItem } from '../cart_item/entities/cart_item.entity';
import { Order } from '../order/entities/order.entity';
import { OrderItem } from '../order/entities/order-item.entity';
import { Wallet } from '../wallet/entities/wallet.entity';
import { RatingAndReview } from '../rating-and-review/entities/rating-and-review.entity';
import { Transaction } from '../transaction/entities/transaction.entity';
import { RoleEnum } from '../core/enums/role.enum';
import { TransactionTypeEnum } from '../core/enums/transaction.enum';
import { OrderShippingStatusEnum } from '../core/enums/order.status.enum';
import { OrderPaymentStatus } from '../core/enums/payment.status.enum';
import { paymentMethod } from '../core/enums/payment.method.enum';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const userRepo = app.get<Repository<User>>(getRepositoryToken(User));
  const walletRepo = app.get<Repository<Wallet>>(getRepositoryToken(Wallet));
  const vendorRepo = app.get<Repository<Vendor>>(getRepositoryToken(Vendor));
  const productRepo = app.get<Repository<Product>>(getRepositoryToken(Product));
  const cartRepo = app.get<Repository<Cart>>(getRepositoryToken(Cart));
  const cartItemRepo = app.get<Repository<CartItem>>(
    getRepositoryToken(CartItem),
  );
  const orderRepo = app.get<Repository<Order>>(getRepositoryToken(Order));
  const orderItemRepo = app.get<Repository<OrderItem>>(
    getRepositoryToken(OrderItem),
  );
  const reviewRepo = app.get<Repository<RatingAndReview>>(
    getRepositoryToken(RatingAndReview),
  );
  const transactionRepo = app.get<Repository<Transaction>>(
    getRepositoryToken(Transaction),
  );

  const users: User[] = [];
  for (let i = 1; i <= 10; i++) {
    const user = userRepo.create({
      name: `User ${i}`,
      email: `user${i}@example.com`,
      password: 'password',
      token: `token-${i}`,
      role: i <= 5 ? RoleEnum.client : RoleEnum.vendor,
      phoneNumber: `0100000000${i}`,
      isVendor: i > 5,
    });
    users.push(user);
  }
  await userRepo.save(users);

  const wallets: Wallet[] = [];
  for (const [index, user] of users.entries()) {
    const wallet = walletRepo.create({
      balance: 1000 + index * 100,
      pendingBalance: 0,
      currency: 'EGP',
      type: 'personal',
      user,
    });
    wallets.push(wallet);
  }
  await walletRepo.save(wallets);

  const vendors: Vendor[] = [];
  const vendorUsers = users.filter((u) => u.isVendor);
  vendorUsers.forEach((user, idx) => {
    const vendor = vendorRepo.create({
      user,
      shopName: `Shop ${idx + 1}`,
      balance: 0,
      rating: 0,
      isVerfied: true,
      isFollowed: false,
    });
    vendors.push(vendor);
  });
  await vendorRepo.save(vendors);

  const products: Product[] = [];
  vendors.forEach((vendor, idx) => {
    for (let i = 1; i <= 2; i++) {
      const product = productRepo.create({
        name: `Product ${idx + 1}-${i}`,
        type: 'general',
        vendor,
        price: 100 * i,
        inStock: 50,
        purchuseCount: 0,
      });
      products.push(product);
    }
  });
  await productRepo.save(products);

  const carts: Cart[] = [];
  users.forEach((user) => {
    const cart = cartRepo.create({
      user,
    });
    carts.push(cart);
  });
  await cartRepo.save(carts);

  const cartItems: CartItem[] = [];
  carts.forEach((cart, idx) => {
    const product = products[idx % products.length];
    const vendor = product.vendor!;
    const quantity = 1 + (idx % 3);
    const cartItem = cartItemRepo.create({
      cart,
      cartId: cart.id,
      product,
      productId: product.id,
      vendor,
      quantity,
      totlePrice: product.price * quantity,
    });
    cartItems.push(cartItem);
  });
  await cartItemRepo.save(cartItems);

  const orders: Order[] = [];
  const orderItems: OrderItem[] = [];

  carts.slice(0, 10).forEach((cart, idx) => {
    const client = cart.user;
    const orderCartItems = cartItems.filter((ci) => ci.cart.id === cart.id);
    const totalAmount = orderCartItems.reduce(
      (sum, ci) => sum + ci.totlePrice,
      0,
    );

    const order = orderRepo.create({
      client,
      totalAmount,
      status: OrderShippingStatusEnum.PENDING,
      paymentStatus: OrderPaymentStatus.pending,
      paymentMethod: paymentMethod.card,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      shippingAddressId: 'dummy-address-id',
      cart,
    });

    orders.push(order);
  });
  await orderRepo.save(orders);

  orders.forEach((order, idx) => {
    const relatedCartItems = cartItems
      .filter((ci) => ci.cart.id === order.cart.id)
      .slice(0, 2);
    relatedCartItems.forEach((ci, j) => {
      const item = orderItemRepo.create({
        order,
        product: ci.product,
        vendor: ci.vendor!,
        quantity: ci.quantity,
        unitPrice: ci.product.price,
        totalPrice: ci.totlePrice,
        status: 'pending',
      });
      orderItems.push(item);
    });
  });
  await orderItemRepo.save(orderItems);

  const reviews: RatingAndReview[] = [];
  users.slice(0, 5).forEach((user, idx) => {
    const product = products[idx];
    const review = reviewRepo.create({
      user,
      product,
      rating: 4,
      comment: `Review ${idx + 1}`,
    });
    reviews.push(review);
  });
  await reviewRepo.save(reviews);

  const transactions: Transaction[] = [];
  wallets.slice(0, 10).forEach((wallet, idx) => {
    const order = orders[idx];
    const tx = transactionRepo.create({
      type: TransactionTypeEnum.ORDER_INCOME,
      amount: 100,
      balanceAfter: wallet.balance + 100,
      order,
      user: wallet.user,
      description: `Seed transaction ${idx + 1}`,
    });
    transactions.push(tx);
  });
  await transactionRepo.save(transactions);

  await app.close();
}

seed()
  .then(() => {
    // eslint-disable-next-line no-console
    console.log('Seeding completed');
    process.exit(0);
  })
  .catch((error) => {
    // eslint-disable-next-line no-console
    console.error('Seeding failed', error);
    process.exit(1);
  });
