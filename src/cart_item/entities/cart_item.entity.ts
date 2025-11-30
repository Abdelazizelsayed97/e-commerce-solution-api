import { ObjectType, Field, Int, Float } from '@nestjs/graphql';
import { Cart } from 'src/cart/entities/cart.entity';
import { Product } from 'src/product/entities/product.entity';
import { Vendor } from 'src/vendor/entities/vendor.entity';
import { Column, Double, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity()
export class CartItem {
  @Field(() => String)
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Field(() => Cart)
  @ManyToOne(() => Cart, (cart) => cart.id)
  cart: Cart;
  @Field(() => Product)
  @ManyToOne(() => Product, (product) => product.id)
  product: Product;
  @Field(() => Vendor)
  @ManyToOne(() => Vendor, (vendor) => vendor.id)
  vendor: Vendor;

  @Field(() => Float)
  @Column()
  quantity: number;

  @Field(() => Float)
  @Column()
  totlePrice: number;
}
