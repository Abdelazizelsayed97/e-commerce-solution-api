import {
  ObjectType,
  Field,
  Int,

  GraphQLTimestamp,
} from '@nestjs/graphql';
import { RatingAndReview } from 'src/rating-and-review/entities/rating-and-review.entity';
import { Vendor } from 'src/vendor/entities/vendor.entity';
import {
  Column,
  Entity,
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
  @Field(() => Vendor)
  @ManyToOne(() => Vendor, (vendor) => vendor.products)
  vendor: Vendor;
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
  @Field(() => GraphQLTimestamp)
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  addedAt: number;
  @Field(() => GraphQLTimestamp)
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: number;
}
