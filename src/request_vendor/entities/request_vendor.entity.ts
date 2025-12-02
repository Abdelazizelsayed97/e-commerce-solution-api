import { ObjectType, Field, GraphQLTimestamp } from '@nestjs/graphql';
import { RequestVendorEnum } from 'src/core/enums/request.vendor.status';
import { Vendor } from 'src/vendor/entities/vendor.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@ObjectType()
@Entity()
export class RequestVendor {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Field()
  @Column()
  status: RequestVendorEnum;
  @Field(() => Vendor)
  @OneToOne(() => Vendor, (vendor) => vendor.request)
  vendor: Vendor;
  @Field(() => GraphQLTimestamp)
  @Column('timestamp')
  createdAt: number;
  @Field(() => GraphQLTimestamp)
  @Column('timestamp')
  updatedAt: number;
}
