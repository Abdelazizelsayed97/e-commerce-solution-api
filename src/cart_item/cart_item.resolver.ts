import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { CartItemService } from './cart_item.service';
import { CartItem } from './entities/cart_item.entity';
import { CreateCartItemInput } from './dto/create-cart_item.input';
import { UpdateCartItemInput } from './dto/update-cart_item.input';

@Resolver(() => CartItem)
export class CartItemResolver {
  constructor(private readonly cartItemService: CartItemService) {}

  @Mutation(() => CartItem)
  createCartItem(
    @Args('createCartItemInput') createCartItemInput: CreateCartItemInput,
  ) {
    return this.cartItemService.addItemToCart(createCartItemInput);
  }

  @Query(() => [CartItem], { name: 'cartItem' })
  findAll() {
    return this.cartItemService.findAll();
  }

  @Query(() => CartItem, { name: 'cartItem' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.cartItemService.findOne(id);
  }

  @Mutation(() => CartItem)
  updateCartItem(
    @Args('updateCartItemInput') updateCartItemInput: UpdateCartItemInput,
  ) {
    return this.cartItemService.update(
      updateCartItemInput.id,
      updateCartItemInput,
    );
  }

  @Mutation(() => CartItem)
  removeCartItem(@Args('id', { type: () => Int }) id: number) {
    return this.cartItemService.remove(id);
  }
}
