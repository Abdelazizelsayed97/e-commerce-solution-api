import { ObjectType, Field, Int, GraphQLTimestamp } from '@nestjs/graphql';
import { Category } from 'src/category/entities/category.entity';
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

  @Field(() => Vendor)
  @ManyToOne(() => Vendor, (vendor) => vendor.products)
  @JoinColumn({
    name: 'vendorId',
    referencedColumnName: 'id',
  })
  vendor: Vendor;

  @Column()
  vendorId: string;

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

  @Field(()=>String)
  @Column({
    nullable: true
  })
   image?:string 

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

  @Field(() => Category, { nullable: true })
  @ManyToOne(() => Category, (category) => category.products, {
    nullable: true,
  })
  @JoinColumn({
    name: 'categoryId',
    referencedColumnName: 'id',
  })
  category: Category;

  @Column()
  categoryId: string;

  @Field(() => Boolean)
  @Column({ default: false })
  isWishListed: boolean;
}
