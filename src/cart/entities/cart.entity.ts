import { ObjectType, Field, GraphQLTimestamp } from '@nestjs/graphql';
import { CartItem } from 'src/cart_item/entities/cart_item.entity';
import { Order } from 'src/order/entities/order.entity';
import { User } from 'src/user/entities/user.entity';
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity()
export class Cart {
  @Field(() => String)
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Field(() => User)
  @ManyToOne(() => User, (user) => user.id)
  userId: User;
  @Field(() => GraphQLTimestamp, { nullable: true })
  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
  createAt: number;
  @Field(() => GraphQLTimestamp, { nullable: true })
  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
  updateAt: number;
  @Field(() => [Order])
  @OneToMany(() => Order, (order) => order.id)
  orders: Order[];
  @Field(() => [CartItem])
  @OneToMany(() => CartItem, (cartItem) => cartItem.id)
  cartItems: CartItem[];
}
