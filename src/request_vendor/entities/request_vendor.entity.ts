import { ObjectType, Field, GraphQLTimestamp } from '@nestjs/graphql';
import { RequestVendorEnum } from 'src/core/enums/request.vendor.status';
import { Vendor } from 'src/vendor/entities/vendor.entity';
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity({ synchronize: true })
export class RequestVendor {
  @Field(()=> String)
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Field(()=>String)
  @Column('enum', { enum: RequestVendorEnum })
  status: RequestVendorEnum;
  // @Field(() => Vendor)
  @OneToOne(() => Vendor, (vendor) => vendor.request)
  vendor: Vendor;

  @Field(()=> String,{nullable:true})
  @Column({
    nullable:true
  })
  rejectMessage?:string
  @Field(() => GraphQLTimestamp)
  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
  createdAt: number;
  @Field(() => GraphQLTimestamp)
  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: number;
}
