import {
  Resolver,
  Query,
  Mutation,
  Args,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { CartItemService } from './cart_item.service';
import { CartItem } from './entities/cart_item.entity';
import { CreateCartItemInput } from './dto/create-cart_item.input';
import { UpdateCartItemInput } from './dto/update-cart_item.input';
import { cartLoader } from 'src/cart/loaders/cart.loader';
import DataLoader from 'dataloader';
import { Cart } from 'src/cart/entities/cart.entity';
import { DataSource } from 'typeorm';
import { cartItemLoader } from './loaders/cart.items.loader';
import { UseGuards, UseInterceptors } from '@nestjs/common';
import { UserResponseInterceptor } from 'src/core/helper/interceptors/user.responce.interceptor';
import { Product } from 'src/product/entities/product.entity';
import { productLoader } from 'src/product/loader/product.loader';
import { AuthGuard } from 'src/user/guard/auth.guard';
import { Vendor } from 'src/vendor/entities/vendor.entity';
import { VendorLoader } from 'src/vendor/loaders/vendor.loader';
import { CurrentUser } from 'src/core/helper/decorators/current.user';
import { User } from 'src/user/entities/user.entity';

@UseInterceptors(UserResponseInterceptor)
@Resolver(() => CartItem)
export class CartItemResolver {
  cartLoader: DataLoader<string, Cart>;
  cartItemLoader: DataLoader<string, CartItem>;
  productLoader: DataLoader<string, Product>;
  vendorLoader: DataLoader<string, Vendor | null>;
  constructor(
    private readonly cartItemService: CartItemService,
    private dataSource: DataSource,
  ) {
    this.cartLoader = cartLoader(dataSource);
    this.cartItemLoader = cartItemLoader(dataSource);
    this.productLoader = productLoader(dataSource);
    this.vendorLoader = VendorLoader(dataSource.getRepository(Vendor));
  }

  @Mutation(() => CartItem)
  @UseGuards(AuthGuard)
  addToCart(
    @Args('createCartItemInput') createCartItemInput: CreateCartItemInput,
    @CurrentUser() user: User,
  ) {
    return this.cartItemService.addItemToCart(createCartItemInput, user);
  }

  @Query(() => [CartItem], { name: 'cartItems' })
  findAll(@CurrentUser() user: User) {
    return this.cartItemService.findAll(user);
  }

  @Query(() => CartItem, { name: 'cartItem' })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.cartItemService.findOne(id);
  }

  @Mutation(() => CartItem)
  @UseGuards(AuthGuard)
  updateCartItem(
    @Args('id', { type: () => String }) id: string,
    @Args('updateCartItemInput') updateCartItemInput: UpdateCartItemInput,
  ) {
    return this.cartItemService.update(id, updateCartItemInput);
  }

  @Mutation(() => CartItem)
  @UseGuards(AuthGuard)
  removeCartItem(@Args('id', { type: () => String }) id: string) {
    return this.cartItemService.remove(id);
  }

  @Mutation(() => String)
  @UseGuards(AuthGuard)
  clearCart(@Args('cartId', { type: () => String }) cartId: string) {
    return this.cartItemService.removeAllFromCart(cartId);
  }
  @ResolveField(() => CartItem, { nullable: true })
  cartItem(@Parent() cartItem: CartItem) {
    if (!cartItem.id) return null;
    return this.cartItemLoader.load(cartItem.id);
  }

  @ResolveField(() => Cart, { nullable: true })
  cart(@Parent() cartItem: CartItem) {
    if (!cartItem.cart) return null;
    return this.cartLoader.load(cartItem.cart.id);
  }

  @ResolveField(() => Product, { nullable: true })
  product(@Parent() cartItem: CartItem) {
    if (!cartItem.product) return null;
    return this.productLoader.load(cartItem.product.id);
  }

  @ResolveField(() => Vendor, { nullable: true })
  vendor(@Parent() cartItem: CartItem) {
    if (!cartItem.vendor) return null;
    return this.vendorLoader.load(cartItem.vendor.id);
  }
}
