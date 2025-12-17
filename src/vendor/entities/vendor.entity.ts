import { ObjectType, Field, GraphQLTimestamp, Float } from '@nestjs/graphql';
import { Follower } from 'src/followers/entities/follower.entity';
import { Order } from 'src/order/entities/order.entity';
import { Product } from 'src/product/entities/product.entity';
import { RequestVendor } from 'src/request_vendor/entities/request_vendor.entity';
import { User } from 'src/user/entities/user.entity';

import { Column, Entity, OneToMany, OneToOne } from 'typeorm';
import { BasicClass } from 'src/core/helper/classes/basic.class';

@ObjectType()
@Entity()
export class Vendor extends BasicClass {
  @Field(() => User)
  @OneToOne(() => User, (user) => user.vendor)
  user: User;

  @Field(() => String)
  @Column()
  shopName: string;

  @Field(() => Float)
  @Column({ default: 0 })
  balance: number;

  @Field(() => Float)
  @Column({ default: 0 })
  rating: number;

  @Field(() => Boolean)
  @Column('boolean', { default: false })
  isVerfied: boolean;

  @Field(() => [Order], { nullable: true, defaultValue: [] })
  @OneToMany(() => Order, (order) => order.id, {
    nullable: true,
  })
  vendorOrders?: Order[];

  @Field(() => [Follower], { nullable: true })
  @OneToMany(() => Follower, (follower) => follower.vendor, { nullable: true })
  followers?: Follower[];

  @OneToOne(() => RequestVendor, (request) => request.vendor, {
    nullable: true,
  })
  @Field(() => RequestVendor, { nullable: true })
  request?: RequestVendor;

  @Field(() => [Product])
  @OneToMany(() => Product, (product) => product.vendor)
  products: Product[];

  @Field(() => Boolean, { defaultValue: false })
  @Column('boolean', { default: false })
  isFollowed: boolean;
}
