import { Field, GraphQLTimestamp, ObjectType } from '@nestjs/graphql';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Product } from './product.entity';

@ObjectType()
@Entity()
export class WishList {
  @Field(() => String)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => Product)
  @ManyToOne(() => Product)
  @JoinColumn({
    name: 'productId',
    referencedColumnName: 'id',
  })
  product: Product;

  @Column()
  productId: string;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.wishList)
  @JoinColumn({
    name: 'userId',
    referencedColumnName: 'id',
  })
  user: User;

  @Column()
  userId: string;

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
