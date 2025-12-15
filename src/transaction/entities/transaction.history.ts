import { Field } from '@nestjs/graphql';
import { Wallet } from 'src/wallet/entities/wallet.entity';
import { Column, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

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
