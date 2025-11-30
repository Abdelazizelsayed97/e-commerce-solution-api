import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { CartModule } from './cart/cart.module';
import { OrderModule } from './order/order.module';
import { VendorModule } from './vendor/vendor.module';
import { NotificationModule } from './notification/notification.module';
import { ProductModule } from './product/product.module';
import { FcmModule } from './fcm/fcm.module';
import { VendorOrdersModule } from './vendor_orders/vendor_orders.module';
import { CartItemModule } from './cart_item/cart_item.module';
import { RoleModule } from './role/role.module';
import { AddressModule } from './address/address.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { ApolloDriver } from '@nestjs/apollo';
import { AuthModule } from './auth/auth.module';
import { QueueModule } from './queue/queue.module';

@Module({
  imports: [
    UserModule,
    CartModule,
    OrderModule,
    VendorModule,
    NotificationModule,
    ProductModule,
    FcmModule,
    VendorOrdersModule,
    CartItemModule,
    RoleModule,
    AddressModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'KareemAlsayed1997@#',
      database: 'e-comerce-db',
      // entities: [__dirname + '/**/*.entity{.ts,.js}'],
      autoLoadEntities: true,
      synchronize: true,
    }),
    GraphQLModule.forRoot({
      driver: ApolloDriver,
      playground: true,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    }),
    AuthModule,
    QueueModule,
  ],
})
export class AppModule {}
