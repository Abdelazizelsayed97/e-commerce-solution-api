import { ObjectType, Field, GraphQLTimestamp } from '@nestjs/graphql';
import { CartItem } from 'src/cart_item/entities/cart_item.entity';
import { Order } from 'src/order/entities/order.entity';
import { User } from 'src/user/entities/user.entity';
import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity()
export class Cart {
  @Field(() => String)
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Field(() => User)
  @OneToOne(() => User, (user) => user.cart)
  @JoinColumn()
  user: User;
  @Field(() => GraphQLTimestamp, { nullable: true })
  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
  createAt: number;
  @Field(() => GraphQLTimestamp, { nullable: true })
  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
  updateAt: number;
  @Field(() => [Order], { nullable: true })
  @OneToMany(() => Order, (order) => order.cart, { nullable: true })
  orders?: Order[];
  @Field(() => [CartItem], { nullable: true })
  @OneToMany(() => CartItem, (cartItem) => cartItem.cart, { nullable: true })
  cartItems?: CartItem[];
}