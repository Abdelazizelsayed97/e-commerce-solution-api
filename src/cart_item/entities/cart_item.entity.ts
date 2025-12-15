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

  @ManyToOne(() => Cart, (cart) => cart.cartItems, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  cart: Cart;

  @Field(() => Product)
  @ManyToOne(() => Product)
  product: Product;

  @Field(() => Vendor)
  @ManyToOne(() => Vendor)
  vendor: Vendor;

  @Field(() => Float)
  @Column()
  quantity: number;

  @Field(() => Float)
  @Column()
  totlePrice: number;
}
