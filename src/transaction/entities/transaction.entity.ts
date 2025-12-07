import { ObjectType, Field, Int, GraphQLTimestamp } from '@nestjs/graphql';
import { TransactionTypeEnum } from 'src/core/enums/transaction.enum';
import { Order } from 'src/order/entities/order.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
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
  order: Order;
  @Field(() => User, { nullable: true })
  @ManyToOne(() => User, { nullable: true })
  user: User;
  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  description: string;
  @Field(() => GraphQLTimestamp)
  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
  @Field(() => Wallet)
  @ManyToOne(() => Wallet, (wallet) => wallet.transactionHistory)
  wallet: Wallet;
}
