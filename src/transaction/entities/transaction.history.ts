import { Field } from '@nestjs/graphql';
import { Wallet } from 'src/wallet/entities/wallet.entity';
import { Column, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

export class TransactionHistory {
  @Field(() => String)
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Field(() => String)
  @Column()
  type: string;
  @Field(() => String)
  @Column()
  amount: string;
  @Field(() => String)
  @Column()
  createdAt: string;
  @Field(() => Wallet)
  @ManyToOne(() => Wallet, (wallet) => wallet.transactionHistory)
  wallet: Wallet;
}
