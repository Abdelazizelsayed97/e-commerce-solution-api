import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Vendor } from 'src/vendor/entities/vendor.entity';
import { Column, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
export class Product {
  @Field(() => String)
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Field(() => String)
  @Column()
  name: string;
  @Field(() => String)
  @Column()
  type: string;
  @Field(() => String)
  @ManyToOne(() => Vendor, (vendor) => vendor.id)
  vendor: Vendor;
}
