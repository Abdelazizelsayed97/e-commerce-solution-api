import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { CartItemService } from './cart_item.service';
import { CartItem } from './entities/cart_item.entity';
import { CreateCartItemInput } from './dto/create-cart_item.input';
import { UpdateCartItemInput } from './dto/update-cart_item.input';

@Resolver(() => CartItem)
export class CartItemResolver {
  constructor(private readonly cartItemService: CartItemService) {}

  @Mutation(() => CartItem)
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
  updateCartItem(
    @Args('id', { type: () => String }) id: string,
    @Args('updateCartItemInput') updateCartItemInput: UpdateCartItemInput,
  ) {
    return this.cartItemService.update(id, updateCartItemInput);
  }

  @Mutation(() => CartItem)
  removeCartItem(@Args('id', { type: () => String }) id: string) {
    return this.cartItemService.remove(id);
  }

  @Mutation(() => String)
  clearCart(@Args('cartId', { type: () => String }) cartId: string) {
    return this.cartItemService.removeAllFromCart(cartId);
  }
}
