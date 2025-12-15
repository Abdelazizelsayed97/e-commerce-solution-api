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
@Entity({ synchronize: true })
export class RequestVendor {
  @Field(() => String)
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Field(() => String)
  @Column('enum', { enum: RequestVendorEnum })
  status: RequestVendorEnum;
  // @Field(() => Vendor)
  @OneToOne(() => Vendor, (vendor) => vendor.request, { onDelete: 'CASCADE' })
  @JoinColumn({
    name: 'vendor_id',
    referencedColumnName: 'id',
  })
  vendor: Vendor;

  @Column()
  vendor_id: string;

  @Field(() => String, { nullable: true })
  @Column({
    nullable: true,
  })
  rejectMessage?: string;
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
