import {
  Resolver,
  Query,
  Mutation,
  Args,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { CartItemService } from './cart-item.service';
import { CartItem } from './entities/cart-item.entity';
import { CreateCartItemInput } from './dto/create-cart_item.input';
import { UpdateCartItemInput } from './dto/update-cart_item.input';
import { CartLoader } from 'src/cart/loaders/cart.loader';
import { Cart } from 'src/cart/entities/cart.entity';
import { UseGuards, UseInterceptors } from '@nestjs/common';
import { UserResponseInterceptor } from 'src/core/helper/interceptors/user.responce.interceptor';
import { Product } from 'src/product/entities/product.entity';
import { ProductLoader } from 'src/product/loader/product.loader';
import { AuthGuard } from 'src/user/guard/auth.guard';
import { Vendor } from 'src/vendor/entities/vendor.entity';
import { VendorLoader } from 'src/vendor/loaders/vendor.loader';
import { CurrentUser } from 'src/core/helper/decorators/current.user';
import { User } from 'src/user/entities/user.entity';
import { CartItemLoader } from './loaders/cart.items.loader';
import { Roles } from 'src/core/helper/decorators/role.mata.decorator';
import { RoleEnum } from 'src/core/enums/role.enum';
import { RolesGuard } from 'src/auth/guards/role.guard';

@UseInterceptors(UserResponseInterceptor)
@Resolver(() => CartItem)
export class CartItemResolver {
  constructor(
    private readonly cartItemService: CartItemService,
    private readonly cartLoader: CartLoader,
    private readonly productLoader: ProductLoader,
    private readonly vendorLoader: VendorLoader,
    private readonly cartItemLoader: CartItemLoader,
  ) {}

  @Mutation(() => CartItem)
  @UseGuards(AuthGuard)
  addToCart(
    @Args('createCartItemInput') createCartItemInput: CreateCartItemInput,
    @CurrentUser() user: User,
  ) {
    return this.cartItemService.addItemToCart(createCartItemInput, user);
  }
  @Roles(RoleEnum.client, RoleEnum.superAdmin)
  @UseGuards(AuthGuard, RolesGuard)
  @Query(() => [CartItem], { name: 'cartItems' })
  findAllCartItems(@CurrentUser() user: User) {
    return this.cartItemService.findAllCartItems(user);
  }

  @Query(() => CartItem, { name: 'cartItem' })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.cartItemService.findOne(id);
  }

  @Mutation(() => CartItem)
  @Roles(RoleEnum.client, RoleEnum.superAdmin)
  @UseGuards(AuthGuard, RolesGuard)
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
    return this.cartItemLoader.loader().load(cartItem.id);
  }

  @ResolveField(() => Cart, { nullable: true })
  cart(@Parent() cartItem: CartItem) {
    if (!cartItem.cart) return null;
    return this.cartLoader.loader().load(cartItem.cart.id);
  }

  @ResolveField(() => Product, { nullable: true })
  product(@Parent() cartItem: CartItem) {
    if (!cartItem.product) return null;
    return this.productLoader.loader().load(cartItem.product.id);
  }

  @ResolveField(() => Vendor, { nullable: true })
  vendor(@Parent() cartItem: CartItem) {
    if (!cartItem.product.vendor) return null;
    return this.vendorLoader.loader().load(cartItem.product.vendor.id);
  }
}
