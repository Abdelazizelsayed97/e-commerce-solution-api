import { ObjectType, Field, Int, GraphQLTimestamp } from '@nestjs/graphql';
import { RatingAndReview } from 'src/rating-and-review/entities/rating-and-review.entity';
import { Vendor } from 'src/vendor/entities/vendor.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@ObjectType()
@Entity({
  synchronize: true,
})
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

  @Field(() => Vendor, { nullable: true })
  @ManyToOne(() => Vendor, (vendor) => vendor.products, { nullable: true })
  @JoinColumn({
    name: 'vendor_id',
    referencedColumnName: 'id',
  })
  vendor: Vendor | null;

  @Column()
  vendor_id: string;

  @Field(() => Int)
  @Column()
  price: number;

  @Field(() => Int)
  @Column()
  inStock: number;

  @Field(() => [RatingAndReview], {
    nullable: true,
  })
  @OneToMany(() => RatingAndReview, (review) => review.product, {
    nullable: true,
  })
  reviews: RatingAndReview[];
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

  @Field(() => Int)
  @Column('int', { default: 0 })
  purchuseCount: number;

  @Field(() => String, { nullable: true })
  @Column({
    type: 'varchar',
    length: 255,
    default: 'Uncategorized',
    nullable: true,
  })
  category: string;

  @Field(() => Boolean)
  @Column({ default: false })
  isWishListed: boolean;
}
