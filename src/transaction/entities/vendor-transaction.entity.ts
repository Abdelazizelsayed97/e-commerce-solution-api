import { ObjectType, Field, Float } from '@nestjs/graphql';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
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
  vendor: Vendor;

  @Field(() => Order)
  @ManyToOne(() => Order)
  order: Order;

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
  createdAt: Date;

  @Field()
  @Column('timestamp', {
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}
