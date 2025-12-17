import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Product } from 'src/product/entities/product.entity';
import { User } from 'src/user/entities/user.entity';
import { Column, ManyToOne, Entity, JoinColumn } from 'typeorm';
import { BasicClass } from 'src/core/helper/classes/basic.class';

@ObjectType()
@Entity()
export class RatingAndReview extends BasicClass {
  @Field(() => Int)
  @Column()
  rating: number;
  @Field(() => String)
  @Column()
  comment: string;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.reviews)
  @JoinColumn({
    name: 'user_id',
    referencedColumnName: 'id',
  })
  user: User;

  @Column()
  user_id: string;

  @Field(() => Product)
  @ManyToOne(() => Product, (product) => product.reviews)
  @JoinColumn({
    name: 'product_id',
    referencedColumnName: 'id',
  })
  product: Product;

  @Column()
  product_id: string;
}
