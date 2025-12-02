import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { CartModule } from './cart/cart.module';
import { OrderModule } from './order/order.module';
import { VendorModule } from './vendor/vendor.module';
import { NotificationModule } from './notification/notification.module';
import { ProductModule } from './product/product.module';
import { FcmModule } from './fcm/fcm.module';
import { VendorOrdersModule } from './vendor_orders/vendor_orders.module';
import { CartItemModule } from './cart_item/cart_item.module';

import { AddressModule } from './address/address.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { ApolloDriver } from '@nestjs/apollo';

import { QueueModule } from './queue/queue.module';
import { EmailModule } from './email/email.module';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { RequestVendorModule } from './request_vendor/request_vendor.module';
import { RatingAndReviewModule } from './rating-and-review/rating-and-review.module';
import { UserInspectorMiddleware } from './core/middlwares/user.middleware';
import { FollowersModule } from './followers/followers.module';

import { User } from './user/entities/user.entity';
import { AuthModule } from './auth/auth.module';
import { SearchModule } from './search/search.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      synchronize: true,
      // dropSchema: true,
    }),
    GraphQLModule.forRoot({
      driver: ApolloDriver,
      playground: true,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    }),

    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '7d', algorithm: 'HS256' },
    }),

    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '7d', algorithm: 'HS256' },
    }),
    AuthModule,
    EmailModule,
    NotificationModule,
    EmailModule,
    NotificationModule,
    QueueModule,
    UserModule,
    CartModule,
    OrderModule,
    VendorModule,
    ProductModule,
    TypeOrmModule.forFeature([User]),
    FcmModule,
    VendorOrdersModule,
    CartItemModule,

    AddressModule,
    RequestVendorModule,

    RatingAndReviewModule,
    FollowersModule,
    SearchModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UserInspectorMiddleware).forRoutes('*');
  }
  constructor() {}
}
