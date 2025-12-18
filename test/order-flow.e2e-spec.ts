import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { faker } from '@faker-js/faker';
import { App } from 'supertest/types';
import { User } from 'src/user/entities/user.entity';
import { Vendor } from 'src/vendor/entities/vendor.entity';
import { Product } from 'src/product/entities/product.entity';
import { CartItem } from 'src/cart-item/entities/cart-item.entity';
import { PaymentService } from 'src/payment/payment.service';
import { Order } from 'src/order/entities/order.entity';
import { Address } from 'src/address/entities/address.entity';
import { OrderPaymentStatus } from 'src/core/enums/payment.status.enum';
import { paymentMethod } from 'src/core/enums/payment.method.enum';
import { RefundReason } from 'src/core/enums/refund.reason.enum';
import stripe from 'stripe';

describe('Order Flow (e2e)', () => {
  let app: INestApplication<App>;
  let createdUser: User;
  let authToken: string;
  let createdVendor: Vendor;
  let createdProduct: Product;
  let createdCartItem: CartItem;
  let createdAddress: Address;
  let createdOrder: Order;
  let paymentService: PaymentService;


  const registerInput = {
    name: faker.person.fullName(),
    email: faker.internet.email(),
    password: 'Password123!',
    phoneNumber: faker.phone.number(),
    device: 'WEB',
    token: faker.string.uuid(),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    paymentService = moduleFixture.get<PaymentService>(PaymentService);
  });

  afterAll(async () => {
    await app.close();
  });

  it('should register a new user', async () => {
    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `
          mutation Register($registerInput: RegisterInput!) {
            register(registerInput: $registerInput) {
              id
              name
              email
              phoneNumber
              cart {
                id
              }
            }
          }
        `,
        variables: {
          registerInput,
        },
      });

    expect(response.status).toBe(200);
    expect(response.body.data.register).toBeDefined();
    expect(response.body.data.register.email).toBe(registerInput.email);
    createdUser = response.body.data.register;
  });

  it('should login the user', async () => {
    const loginInput = {
      email: registerInput.email,
      password: registerInput.password,
    };

    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `
          mutation Login($loginInput: LoginInput!) {
            login(loginInput: $loginInput) {
              access_token
            }
          }
        `,
        variables: {
          loginInput,
        },
      });

    expect(response.status).toBe(200);
    expect(response.body.data.login.access_token).toBeDefined();
    authToken = response.body.data.login.access_token;
  });

  it('should create a new vendor and product', async () => {
    // Create a vendor
    const createVendorInput = {
      user_id: createdUser.id,
      shopName: faker.company.name(),
    };

    const vendorResponse = await request(app.getHttpServer())
      .post('/graphql')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        query: `
          mutation CreateVendor($createVendorInput: CreateVendorInput!) {
            createVendor(createVendorInput: $createVendorInput) {
              id
              shopName
            }
          }
        `,
        variables: {
          createVendorInput,
        },
      });

    expect(vendorResponse.status).toBe(200);
    expect(vendorResponse.body.data.createVendor).toBeDefined();
    createdVendor = vendorResponse.body.data.createVendor;

    // Create a product
    const createProductInput = {
      name: faker.commerce.productName(),
      vendorId: createdVendor.id,
      stock: 10,
      price: 100,
    };

    const productResponse = await request(app.getHttpServer())
      .post('/graphql')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        query: `
          mutation CreateProduct($createProductInput: CreateProductInput!) {
            createProduct(createProductInput: $createProductInput) {
              id
              name
              price
              stock
            }
          }
        `,
        variables: {
          createProductInput,
        },
      });

    expect(productResponse.status).toBe(200);
    expect(productResponse.body.data.createProduct).toBeDefined();
    createdProduct = productResponse.body.data.createProduct;
  });

  it('should add a product to the cart', async () => {
    const createCartItemInput = {
      productId: createdProduct.id,
      quantity: 1,
    };

    const response = await request(app.getHttpServer())
      .post('/graphql')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        query: `
          mutation AddToCart($createCartItemInput: CreateCartItemInput!) {
            addToCart(createCartItemInput: $createCartItemInput) {
              id
              quantity
            }
          }
        `,
        variables: {
          createCartItemInput,
        },
      });

    expect(response.status).toBe(200);
    expect(response.body.data.addToCart).toBeDefined();
    expect(response.body.data.addToCart.quantity).toBe(
      createCartItemInput.quantity,
    );
    createdCartItem = response.body.data.addToCart;
  });

  it('should create an address and an order', async () => {
    // Create an address
    const createAddressInput = {
      state: faker.location.state(),
      city: faker.location.city(),
      details: faker.location.streetAddress(),
      userid: createdUser.id,
    };

    const addressResponse = await request(app.getHttpServer())
      .post('/graphql')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        query: `
          mutation CreateAddress($createAddressInput: CreateAddressInput!) {
            createAddress(createAddressInput: $createAddressInput) {
              id
            }
          }
        `,
        variables: {
          createAddressInput,
        },
      });

    expect(addressResponse.status).toBe(200);
    expect(addressResponse.body.data.createAddress).toBeDefined();
    createdAddress = addressResponse.body.data.createAddress;

    // Create an order
    const createOrderInput = {
      paymentStatus: OrderPaymentStatus.PENDING,
      paymentMethod: paymentMethod.CASH,
      shippingAddressId: createdAddress.id,
      cartId: createdUser.cart.id,
    };

    const orderResponse = await request(app.getHttpServer())
      .post('/graphql')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        query: `
          mutation CreateOrder($createOrderInput: CreateOrderInput!) {
            createOrder(createOrderInput: $createOrderInput) {
              id
              paymentStatus
            }
          }
        `,
        variables: {
          createOrderInput,
        },
      });

    expect(orderResponse.status).toBe(200);
    expect(orderResponse.body.data.createOrder).toBeDefined();
    createdOrder = response.body.data.createOrder;
  });

  it('should process payment for the order', async () => {
    // Mock a Stripe session object
    const mockSession: Partial<stripe.Checkout.Session> = {
      id: faker.string.uuid(),
      client_reference_id: createdOrder.id,
      customer_details: { email: createdUser.email },
      amount_total: createdProduct.price * createdCartItem.quantity * 100, // Amount in cents
      currency: 'usd',
    };

    // Call the handlePaymentSuccess method directly
    await paymentService.handlePaymentSuccess(
      mockSession as stripe.Checkout.Session,
    );

    // Verify the order's payment status has been updated
    const orderResponse = await request(app.getHttpServer())
      .post('/graphql')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        query: `
          query Order($orderId: String!) {
            order(orderId: $orderId) {
              id
              paymentStatus
            }
          }
        `,
        variables: {
          orderId: createdOrder.id,
        },
      });

    expect(orderResponse.status).toBe(200);
    expect(orderResponse.body.data.order).toBeDefined();
    expect(orderResponse.body.data.order.paymentStatus).toBe(
      OrderPaymentStatus.paid,
    );
  });

  it('should refund the payment for the order', async () => {
    const refundReason = RefundReason.CUSTOMER_REQUEST;

    const response = await request(app.getHttpServer())
      .post('/graphql')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        query: `
          mutation Refund($orderId: String!, $reason: RefundReason!) {
            refund(orderID: $orderId, reason: $reason)
          }
        `,
        variables: {
          orderId: createdOrder.id,
          reason: refundReason,
        },
      });

    expect(response.status).toBe(200);
    expect(response.body.data.refund).toBeDefined();
    expect(response.body.data.refund).toBe('Refund request submitted successfully');

    // Verify the order's payment status has been updated to refunded
    const orderResponse = await request(app.getHttpServer())
      .post('/graphql')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        query: `
          query Order($orderId: String!) {
            order(orderId: $orderId) {
              id
              paymentStatus
            }
          }
        `,
        variables: {
          orderId: createdOrder.id,
        },
      });

    expect(orderResponse.status).toBe(200);
    expect(orderResponse.body.data.order).toBeDefined();
    expect(orderResponse.body.data.order.paymentStatus).toBe(
      OrderPaymentStatus.refunded,
    );
  });
});