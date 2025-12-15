import { ObjectType, Field, Int, GraphQLTimestamp } from '@nestjs/graphql';
import { TransactionTypeEnum } from 'src/core/enums/transaction.enum';
import { Order } from 'src/order/entities/order.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Wallet } from 'src/wallet/entities/wallet.entity';

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
  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Field()
  @Column('decimal', { precision: 10, scale: 2 })
  balanceAfter: number;

  @Field(() => Order, { nullable: true })
  @ManyToOne(() => Order, { nullable: true })
  @JoinColumn({
    name: 'order_id',
    referencedColumnName: 'id',
  })
  order: Order;

  @Column()
  order_id: string;

  @Field(() => User, { nullable: true })
  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({
    name: 'user_id',
    referencedColumnName: 'id',
  })
  user: User;

  @Column()
  user_id: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  description: string;

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

  @Field(() => Wallet)
  @ManyToOne(() => Wallet, (wallet) => wallet.transactionHistory)
  @JoinColumn({
    name: 'wallet_id',
    referencedColumnName: 'id',
  })
  wallet: Wallet;

  @Column()
  wallet_id: string;
}
