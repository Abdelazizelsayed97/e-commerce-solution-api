import { ObjectType, Field, Float } from '@nestjs/graphql';
import { Cart } from 'src/cart/entities/cart.entity';
import { Product } from 'src/product/entities/product.entity';
import { Vendor } from 'src/vendor/entities/vendor.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity()
export class CartItem {
  @Field(() => String)
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Field(() => String)
  @Column()
  cartId: string;
  @Field(() => Cart)
  @ManyToOne(() => Cart, (cart) => cart.cartItems, { onDelete: 'CASCADE' })
  cart: Cart;
  @Field(() => String)
  @Column()
  productId: string;
  @Field(() => Product)
  @ManyToOne(() => Product)
  product: Product;

  @Field(() => Vendor, { nullable: true })
  @ManyToOne(() => Vendor)
  vendor?: Vendor;

  @Field(() => Float)
  @Column()
  quantity: number;

  @Field(() => Float)
  @Column()
  totlePrice: number;
}
