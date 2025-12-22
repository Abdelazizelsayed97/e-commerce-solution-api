import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { CartModule } from './cart/cart.module';
import { OrderModule } from './order/order.module';
import { VendorModule } from './vendor/vendor.module';
import { NotificationModule } from './notification/notification.module';
import { ProductModule } from './product/product.module';
import { FcmModule } from './fcm/fcm.module';
import { CartItemModule } from './cart-item/cart-item.module';
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
import { FollowersModule } from './followers/followers.module';
import { User } from './user/entities/user.entity';
import { AuthModule } from './auth/auth.module';
import { SearchModule } from './search/search.module';
import { TransactionModule } from './transaction/transaction.module';
import { WalletModule } from './wallet/wallet.module';
import { PaymentModule } from './payment/payment.module';
import { UserInjectorInterceptor } from './core/helper/interceptors/user.injector.interceptor';
import { SuperAdminSeeder } from './super-admin.seeder';
import { CategoryModule } from './category/category.module';
import * as express from 'express';
import { UploadFileModule } from './upload-file/upload-file.module';
import { ThrottlerModule } from '@nestjs/throttler';
import session from 'express-session';
import { PassportModule } from '@nestjs/passport';
import { I18nModule, I18nJsonLoader } from 'nestjs-i18n';
import * as path from 'path';

@Module({
  imports: [
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

    ThrottlerModule.forRoot({
      throttlers: [
        {
          name: 'login',
          ttl: 60,
          limit: 5,
        },
        {
          name: 'register',
          ttl: 60,
          limit: 5,
        },
        {
          name: 'otp',
          ttl: 60,
          limit: 5,
        },
      ],
    }),

    PassportModule.register({ session: true }),
    // I18nModule.forRoot({
    //   fallbackLanguage: 'en',

    //   loaderOptions: {
    //     path: path.join(__dirname, '/i18n/'),
    //     watch: true,
    //   },

    // }),

    AuthModule,
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
    CartItemModule,
    AddressModule,
    RequestVendorModule,
    RatingAndReviewModule,
    FollowersModule,
    SearchModule,
    TransactionModule,
    WalletModule,
    PaymentModule,
    CategoryModule,
    UploadFileModule,
  ],
  providers: [SuperAdminSeeder],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UserInjectorInterceptor).forRoutes('*');
    consumer
      .apply(express.raw({ type: 'application/json' }))
      .forRoutes('webhooks/stripe', 'refund');
    consumer
      .apply(
        session({
          secret: process.env.JWT_SECRET || 'your-secret-key',
          resave: false,
          saveUninitialized: false,
          cookie: {
            secure: false,
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
          },
        }),
      )
      .forRoutes('*');
  }
}
