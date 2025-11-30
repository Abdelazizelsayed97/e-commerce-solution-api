import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Shipping_Status } from 'src/core/enums/shipping.status.enum';
import { VendorPaymentStatus } from 'src/core/enums/vendor.payment.status.enum';
import { Order } from 'src/order/entities/order.entity';
import { Vendor } from 'src/vendor/entities/vendor.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
  @Entity()
export class VendorOrder {
  @Field(() => String)
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Field(() => Order)
  @ManyToOne(() => Order, (order) => order.id)
  order: Order;
  @Field(() => Vendor)
  @ManyToOne(() => Vendor, (vendor) => vendor.id)
  vendor: Vendor;
  @Field(() => Int)
  @Column()
  subtotal: number;
  @Field(() => Int)
  @Column()
  commission: number;
  @Field(() => Int)
  @Column()
  payoutAmount: number;
  @Field(() => VendorPaymentStatus)
  @Column('enum', { enum: VendorPaymentStatus })
  payoutStatus: VendorPaymentStatus;
  @Field(() => Shipping_Status)
  @Column('enum', { enum: Shipping_Status })
  shippingStatus: Shipping_Status;
}
