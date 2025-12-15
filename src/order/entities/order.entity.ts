import { ObjectType, Field, Float, GraphQLTimestamp } from '@nestjs/graphql';
import { Cart } from 'src/cart/entities/cart.entity';
import { paymentMethod } from 'src/core/enums/payment.method.enum';
import { OrderPaymentStatus } from 'src/core/enums/payment.status.enum';
import { OrderShippingStatusEnum } from 'src/core/enums/order.status.enum';
import { User } from 'src/user/entities/user.entity';

import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { OrderItem } from './order-item.entity';

@ObjectType()
@Entity({ synchronize: true })
export class Order {
  @Field(() => String)
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Field(() => User)
  @ManyToOne(() => User, (user) => user.order)
  @JoinColumn({
    name: 'user_id',
    referencedColumnName: 'id',
  })
  client: User;

  @Column()
  user_id: string;

  @Field(() => Float)
  @Column()
  totalAmount: number;

  @Field(() => OrderShippingStatusEnum)
  @Column('enum', {
    enum: OrderShippingStatusEnum,
    default: OrderShippingStatusEnum.PENDING,
  })
  status: OrderShippingStatusEnum;

  @Field(() => OrderPaymentStatus)
  @Column('enum', {
    enum: OrderPaymentStatus,
    default: OrderPaymentStatus.pending,
  })
  paymentStatus: OrderPaymentStatus;

  @Field(() => paymentMethod)
  @Column('enum', { enum: paymentMethod })
  paymentMethod: paymentMethod;

  @Field()
  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
  createdAt: number;

  @Field({
    nullable: true,
  })
  @Column('timestamp', {
    onUpdate: 'CURRENT_TIMESTAMP',
    nullable: true,
  })
  updatedAt: number;

  @Field(() => String)
  @Column()
  shippingAddressId: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  transactionId: string;

  @Field(() => Cart)
  @ManyToOne(() => Cart, (cart) => cart.id)
  @JoinColumn({
    name: 'cart_id',
    referencedColumnName: 'id',
  })
  cart: Cart;

  @Field(() => String)
  @Column()
  cart_id: string;

  @Field(() => [OrderItem], { nullable: true })
  @OneToMany(() => OrderItem, (item) => item.order, { cascade: true })
  orderItems?: OrderItem[];
}
