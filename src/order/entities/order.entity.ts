import {
  ObjectType,
  Field,
  Float,
  GraphQLTimestamp,
} from '@nestjs/graphql';
import { paymentMethod } from 'src/core/enums/payment.method.enum';
import { OrderPaymentStatus } from 'src/core/enums/payment.status.enum';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  Double,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Timestamp,
} from 'typeorm';

@ObjectType()
@Entity({ synchronize: true })
export class Order {
  @Field(() => String)
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Field(() => User)
  @ManyToOne(() => User, (user) => user.id)
  userId: User;
  @Field(() => Float)
  @Column()
  totalAmount: number;
  @Field(() => OrderPaymentStatus)
  @Column('enum', { enum: OrderPaymentStatus })
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
}
