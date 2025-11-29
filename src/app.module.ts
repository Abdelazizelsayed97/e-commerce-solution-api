import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
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

@Module({
  imports: [UserModule, CartModule, OrderModule, VendorModule, NotificationModule, ProductModule, FcmModule, VendorOrdersModule, CartItemModule, RoleModule, AddressModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
