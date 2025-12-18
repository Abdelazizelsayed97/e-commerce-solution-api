import { ObjectType, Field, GraphQLTimestamp, Int } from '@nestjs/graphql';
import { CartItem } from 'src/cart-item/entities/cart-item.entity';
import { Order } from 'src/order/entities/order.entity';
import { User } from 'src/user/entities/user.entity';
import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { BasicClass } from 'src/core/helper/classes/basic.class';

@ObjectType()
@Entity()
export class Cart extends BasicClass {
  @Field(() => User)
  @OneToOne(() => User, (user) => user.cart)
  @JoinColumn({
    name: 'user_id',
    referencedColumnName: 'id',
  })
  user: User;

  @Column()
  user_id: string;

  @Field(() => [Order], { nullable: true })
  @OneToMany(() => Order, (order) => order.cart, { nullable: true })
  orders?: Order[];

  @Field(() => [CartItem], { nullable: true })
  @OneToMany(() => CartItem, (cartItem) => cartItem.cart, { nullable: true })
  cartItems?: CartItem[];
  @Field(() => Int)
  @Column('int', { default: 0 })
  totalPrice: number;
}
