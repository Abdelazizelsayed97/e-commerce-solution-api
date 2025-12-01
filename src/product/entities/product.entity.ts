import { ObjectType, Field, Int, Float } from '@nestjs/graphql';
import { Vendor } from 'src/vendor/entities/vendor.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity()
export class Product {
  @Field(() => String)
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Field(() => String)
  @Column('text')
  name: string;
  @Field(() => String)
  @Column('text')
  type: string;
  @Field(() => Vendor)
  @ManyToOne(() => Vendor, (vendor) => vendor.id)
  vendor: Vendor;
  @Field(() => Float)
  @Column('float')
  price: number;
}
