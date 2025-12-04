import { ObjectType, Field, Float, GraphQLTimestamp } from '@nestjs/graphql';
import { Cart } from 'src/cart/entities/cart.entity';
import { paymentMethod } from 'src/core/enums/payment.method.enum';
import { OrderPaymentStatus } from 'src/core/enums/payment.status.enum';
import { User } from 'src/user/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity({ synchronize: true })
export class Order {
  @Field(() => String)
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Field(() => User)
  @ManyToOne(() => User, (user) => user.order)
  client: User;
  @Field(() => Float)
  @Column()
  totalAmount: number;
  @Field(() => OrderPaymentStatus)
  @Column('enum', {
    enum: OrderPaymentStatus,
    default: OrderPaymentStatus.pending,
  })
  paymentStatus: OrderPaymentStatus;
  @Field(() => paymentMethod)
  @Column('enum', { enum: paymentMethod })
  paymentMethod: paymentMethod;
  @Field(() => GraphQLTimestamp)
  @Column()
  createdAt: number;
  @Field(() => GraphQLTimestamp)
  @Column()
  updatedAt: number;
  @Field(() => String)
  @Column()
  shippingAddressId: string;
  @Field(() => String)
  @Column()
  transactionId: string;
  @Field(() => Cart)
  @ManyToOne(() => Cart, (cart) => cart.id)
  cart: Cart;
}
