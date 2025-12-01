import { ObjectType, Field, GraphQLTimestamp } from '@nestjs/graphql';
import { RequestVendorEnum } from 'src/core/enums/request.vendor.status';
import { Vendor } from 'src/vendor/entities/vendor.entity';
import { Column, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
export class RequestVendor {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Field()
  @Column()
  status: RequestVendorEnum;
  @Field(() => String)
  @OneToOne(() => Vendor, (vendor) => vendor.id)
  vendor: Vendor;
  @Field(() => GraphQLTimestamp)
  @Column('timestamp')
  createdAt: number;
  @Field(() => GraphQLTimestamp)
  @Column('timestamp')
  updatedAt: number;
}
