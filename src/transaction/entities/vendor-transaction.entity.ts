import { ObjectType, Field, Float } from '@nestjs/graphql';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Vendor } from 'src/vendor/entities/vendor.entity';
import { Order } from 'src/order/entities/order.entity';
import { OrderPaymentStatus } from 'src/core/enums/payment.status.enum';
import { TransactionTypeEnum } from 'src/core/enums/transaction.enum';

@ObjectType()
@Entity()
export class VendorTransaction {
  @Field(() => String)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => Vendor)
  @ManyToOne(() => Vendor)
  @JoinColumn({
    name: 'vendorId',
    referencedColumnName: 'id',
  })
  vendor: Vendor;

  @Column()
  vendorId: string;

  @Field(() => Order)
  @ManyToOne(() => Order)
  @JoinColumn({
    name: 'orderId',
    referencedColumnName: 'id',
  })
  order: Order;

  @Column()
  orderId: string;

  @Field(() => TransactionTypeEnum)
  @Column('enum', { enum: TransactionTypeEnum })
  type: TransactionTypeEnum;

  @Field(() => Float)
  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Field(() => String)
  @Column('enum', {
    default: OrderPaymentStatus.pending,
    enum: OrderPaymentStatus,
  })
  status: OrderPaymentStatus;

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
}
