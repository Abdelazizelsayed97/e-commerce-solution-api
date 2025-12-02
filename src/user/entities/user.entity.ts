import { ObjectType, Field, GraphQLTimestamp } from '@nestjs/graphql';

import {
  PrimaryGeneratedColumn,
  JoinColumn,
  OneToMany,
  Column,
  Entity,
} from 'typeorm';
import { Address } from 'src/address/entities/address.entity';
import { Follower } from 'src/followers/entities/follower.entity';
import { RoleEnum } from 'src/core/enums/role.enum';

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
  @OneToMany(() => Address, (address) => address.id, { nullable: true })
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
}
