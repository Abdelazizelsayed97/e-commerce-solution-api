import { ObjectType, Field, Float } from '@nestjs/graphql';
import { Cart } from 'src/cart/entities/cart.entity';
import { Product } from 'src/product/entities/product.entity';
import { Vendor } from 'src/vendor/entities/vendor.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BasicClass } from 'src/core/helper/classes/basic.class';

@ObjectType()
@Entity()
export class CartItem extends BasicClass {
  @ManyToOne(() => Cart, (cart) => cart.cartItems, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({
    name: 'cart_id',
    referencedColumnName: 'id',
  })
  cart: Cart;

  @Column()
  cart_id: string;

  @Field(() => Product)
  @ManyToOne(() => Product)
  @JoinColumn({
    name: 'product_id',
    referencedColumnName: 'id',
  })
  product: Product;

  @Column()
  product_id: string;

  @Field(() => Float)
  @Column()
  quantity: number;

  @Field(() => Float)
  @Column()
  totlePrice: number;
}
