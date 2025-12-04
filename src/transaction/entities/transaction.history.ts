import { Field } from '@nestjs/graphql';
import { Column, PrimaryGeneratedColumn } from 'typeorm';

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
}
