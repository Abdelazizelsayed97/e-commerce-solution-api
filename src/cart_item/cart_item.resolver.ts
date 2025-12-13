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

@UseInterceptors(UserResponseInterceptor)
@Resolver(() => CartItem)
export class CartItemResolver {
  cartLoader: DataLoader<string, Cart>;
  cartItemLoader: DataLoader<string, CartItem>;
  productLoader: DataLoader<string, Product>;
  constructor(
    private readonly cartItemService: CartItemService,
    private dataSource: DataSource,
  ) {
    this.cartLoader = cartLoader(dataSource);
    this.cartItemLoader = cartItemLoader(dataSource);
    this.productLoader = productLoader(dataSource);
  }

  @Mutation(() => CartItem)
  @UseGuards(AuthGuard)
  addToCart(
    @Args('createCartItemInput') createCartItemInput: CreateCartItemInput,
  ) {
    return this.cartItemService.addItemToCart(createCartItemInput);
  }

  @Query(() => [CartItem], { name: 'cartItems' })
  findAll(@Args('cartId', { type: () => String }) cartId: string) {
    return this.cartItemService.findAll(cartId);
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
  @ResolveField(() => CartItem)
  cartItem(@Parent() cartItem) {
    console.log('cartLoader==++==', cartItem);
    return this.cartItemLoader.load(cartItem.id);
  }
  @ResolveField(() => Cart)
  cart(@Parent() cartItem) {
    console.log('cartLoader====', cartItem);
    return this.cartLoader.load('1211cf5b-f047-4b03-a70f-7c0ea7b1db8a');
  }
  @ResolveField(() => Product)
  product(@Parent() cartItem) {
    return this.productLoader.load(cartItem.productId);
  }
}
