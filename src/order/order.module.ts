import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderResolver } from './order.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { PaymentController } from 'src/payment/payment.controller';

@Module({
  providers: [OrderResolver, OrderService],
  exports: [OrderService],
  imports: [TypeOrmModule.forFeature([Order])],
  controllers: [PaymentController],
  
})
export class OrderModule {}
