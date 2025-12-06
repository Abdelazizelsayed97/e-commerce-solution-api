import { ObjectType, Field, Float } from '@nestjs/graphql';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Order } from './order.entity';
import { Product } from 'src/product/entities/product.entity';
import { Vendor } from 'src/vendor/entities/vendor.entity';

@ObjectType()
@Entity()
export class OrderItem {
  @Field(() => String)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => Order)
  @ManyToOne(() => Order, (order) => order.orderItems, { onDelete: 'CASCADE' })
  order: Order;

  @Field(() => Product)
  @ManyToOne(() => Product)
  product: Product;

  @Field(() => Vendor)
  @ManyToOne(() => Vendor)
  vendor: Vendor;

  @Field(() => Float)
  @Column()
  quantity: number;

  @Field(() => Float)
  @Column()
  unitPrice: number;

  @Field(() => Float)
  @Column()
  totalPrice: number;

  @Field(() => String, { defaultValue: 'pending' })
  @Column({ default: 'pending' })
  status: string;
}
