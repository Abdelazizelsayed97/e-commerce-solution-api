import { ObjectType, Field, Float } from '@nestjs/graphql';
import { Transaction } from 'src/transaction/entities/transaction.entity';
import { User } from 'src/user/entities/user.entity';
import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { PrimaryGeneratedColumn } from 'typeorm/decorator/columns/PrimaryGeneratedColumn.js';

@ObjectType()
@Entity()
export class Wallet {
  @Field(() => String)
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Field(() => Float)
  @Column('float')
  balance: number;
  @Field(() => Float)
  @Column('float', { default: 0 })
  pendingBalance: number;
  @Field(() => String, { defaultValue: 'EGP' })
  @Column({ default: 'EGP' })
  currency: string;
  @Field(() => String)
  @Column()
  type: string;
  @Field(() => [Transaction],{
    nullable: true,
  })
  @OneToMany(() => Transaction, (transaction) => transaction.wallet, {
    nullable: true,
  })
  transactionHistory: Transaction[];
  @Field(() => User)
  @OneToOne(() => User, (user) => user.wallet)
  @JoinColumn()
  user: User;
}
