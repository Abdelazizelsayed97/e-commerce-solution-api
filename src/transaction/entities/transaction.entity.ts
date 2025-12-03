import { ObjectType, Field, Int, GraphQLTimestamp } from '@nestjs/graphql';
import { TransactionTypeEnum } from 'src/core/enums/transaction.enum';
import { Order } from 'src/order/entities/order.entity';
import {
  Column,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@ObjectType()
@Entity()
export class Transaction {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Field(() => TransactionTypeEnum)
  @Column('enum', { enum: TransactionTypeEnum })
  type: TransactionTypeEnum;
  @Field(() => Int)
  @Column()
  amount: number;
  @Field()
  @Column()
  balanceAfter: number;
  @Field(() => Order)
  @OneToOne(() => Order, (order) => order.id)
  orderId: Order;
  @Field(() => GraphQLTimestamp)
  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
