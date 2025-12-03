import { ObjectType, Field, Int } from '@nestjs/graphql';
import { User } from 'src/user/entities/user.entity';
import { Entity, JoinColumn, OneToOne } from 'typeorm';
import { PrimaryGeneratedColumn } from 'typeorm/decorator/columns/PrimaryGeneratedColumn.js';

@ObjectType()
@Entity()
export class Wallet {
  @Field(() => String)
  @PrimaryGeneratedColumn('uuid')
  
  id: string;
  @Field(() => Int)
  balance: number;
  @Field(() => Int)
  pendingBalance: number;
  @Field(() => String)
  currency: string;
  @Field(() => String)
  type: string;
  @Field(() => Int)
  lastUpdated: number;
  @Field(() => [String])
  transactionids: string[];
  @Field(() => User)
  @OneToOne(() => User, (user) => user.wallet)
  @JoinColumn()
  user: User;
}
