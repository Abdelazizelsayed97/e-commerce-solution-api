import { ObjectType, Field, GraphQLTimestamp, Float } from '@nestjs/graphql';
import { Follower } from 'src/followers/entities/follower.entity';
import { RequestVendor } from 'src/request_vendor/entities/request_vendor.entity';
import { User } from 'src/user/entities/user.entity';

import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { VendorOrder } from 'src/vendor_orders/entities/vendor_order.entity';

@ObjectType()
@Entity()
export class Vendor {
  @Field(() => String)
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Field(() => User)
  @JoinColumn()
  @OneToOne(() => User, (user) => user.id)
  user: User;
  @Field(() => String)
  @Column()
  shopName: string;
  @Field(() => Float)
  @Field(() => Float)
  @Column()
  balance: number;
  @Field(() => Float)
  @Field(() => Float)
  @Column()
  rating: number;
  @Field(() => Boolean)
  @Column('boolean', { default: false })
  @Column('boolean', { default: false })
  isVerfied: boolean;
  @Field(() => [VendorOrder])
  @OneToMany(() => VendorOrder, (vendorOrder) => vendorOrder.vendor)
  vendorOrders: VendorOrder[];
  @Field(() => GraphQLTimestamp)
  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
  createdAt: number;
  @Field(() => GraphQLTimestamp)
  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: number;
  @Field(() => [Follower])
  @OneToMany(() => Follower, (follower) => follower.vendor)
  followers: Follower[];
  @OneToOne(() => RequestVendor, (request) => request.vendor)
  @Field(() => RequestVendor)
  request: RequestVendor;
}
