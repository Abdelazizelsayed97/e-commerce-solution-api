import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Product } from 'src/product/entities/product.entity';
import { User } from 'src/user/entities/user.entity';
import { PrimaryGeneratedColumn, Column, ManyToOne, Entity } from 'typeorm';

@ObjectType()
@Entity()
export class RatingAndReview {
  @Field(() => String)
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Field(() => Int)
  @Column()
  rating: number;
  @Field(() => String)
  @Column()
  comment: string;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.reviews)
  user: User;

  @Field(() => Product)
  @ManyToOne(() => Product, (product) => product.reviews)
  product: Product;
}
