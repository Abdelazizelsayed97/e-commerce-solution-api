import { ObjectType, Field, Float, GraphQLTimestamp } from '@nestjs/graphql';
import { Cart } from 'src/cart/entities/cart.entity';
import { paymentMethod } from 'src/core/enums/payment.method.enum';
import { OrderPaymentStatus } from 'src/core/enums/payment.status.enum';
import { OrderShippingStatusEnum } from 'src/core/enums/order.status.enum';
import { User } from 'src/user/entities/user.entity';

import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { OrderItem } from './order-item.entity';
import { BasicClass } from 'src/core/helper/classes/basic.class';

@ObjectType()
@Entity({ synchronize: true })
export class Order extends BasicClass {
  @Field(() => User)
  @ManyToOne(() => User, (user) => user.order)
  @JoinColumn({
    name: 'userId',
    referencedColumnName: 'id',
  })
  client: User;

  @Column()
  userId: string;

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

  @Field(() => String)
  @Column()
  shippingAddressId: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  transactionId: string;

  @Field(() => Cart)
  @ManyToOne(() => Cart, (cart) => cart.id)
  @JoinColumn({
    name: 'cartId',
    referencedColumnName: 'id',
  })
  cart: Cart;

  @Field(() => String)
  @Column()
  cartId: string;

  @Field(() => [OrderItem], { nullable: true })
  @OneToMany(() => OrderItem, (item) => item.order, { cascade: true })
  orderItems?: OrderItem[];
}
