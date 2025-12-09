import { ObjectType, Field, GraphQLTimestamp } from '@nestjs/graphql';
import {
  PrimaryGeneratedColumn,
  JoinColumn,
  OneToMany,
  Column,
  Entity,
  OneToOne,
} from 'typeorm';
import { Address } from 'src/address/entities/address.entity';
import { Follower } from 'src/followers/entities/follower.entity';
import { RoleEnum } from 'src/core/enums/role.enum';
import { Vendor } from 'src/vendor/entities/vendor.entity';
import { Wallet } from 'src/wallet/entities/wallet.entity';
import { Order } from 'src/order/entities/order.entity';
import { RatingAndReview } from 'src/rating-and-review/entities/rating-and-review.entity';
import { Cart } from 'src/cart/entities/cart.entity';


@ObjectType()
@Entity()
export class User {
  @Field(() => String)
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Field(() => String)
  @Column()
  name: string;
  @Field(() => String)
  @Column()
  email: string;
  @Column()
  password: string;
  @Field(() => String)
  @Column()
  token: string;
  @Field(() => RoleEnum)
  @Column('enum', { enum: RoleEnum })
  role: RoleEnum;
  @Field(() => [Address], { nullable: true })
  @OneToMany(() => Address, (address) => address.user, { nullable: true })
  @JoinColumn()
  address?: Address[];
  @Field(() => String)
  @Column()
  phoneNumber: string;
  @Field(() => Boolean, { defaultValue: false })
  @Column({ default: false })
  isVendor: boolean;
  @Field(() => [Follower])
  @OneToMany(() => Follower, (follower) => follower.follower, {
    nullable: true,
  })
  followers?: Follower[];
  @Field(() => [Follower], { nullable: true })
  @OneToMany(() => Follower, (follower) => follower.vendor, { nullable: true })
  followingVendor?: Follower[];
  @Field(() => GraphQLTimestamp, { nullable: true })
  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
  createAt: number;
  @Field(() => GraphQLTimestamp, { nullable: true })
  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
  updateAt: number;
  @Column({ nullable: true })
  OtpCode?: string;
  @Field(() => Vendor, { nullable: true })
  @OneToOne(() => Vendor, (vendor) => vendor.user, { nullable: true })
  @JoinColumn()
  vendor?: Vendor;
  @Field(() => Wallet, { nullable: true })
  @Field(() => Wallet, { nullable: true })
  @OneToOne(() => Wallet, (wallet) => wallet.user, { nullable: true })
  wallet: Wallet;
  @Field(() => [Order])
  @OneToMany(() => Order, (order) => order.client)
  order: Order[];
  @Field(() => [RatingAndReview])
  @OneToMany(() => RatingAndReview, (review) => review.user)
  reviews: RatingAndReview[];
  @Field(() => Cart)
  @OneToOne(() => Cart, (cart) => cart.user)
  cart: Cart
}
