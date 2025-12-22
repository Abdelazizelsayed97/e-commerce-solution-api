import {
  Resolver,
  Query,
  Mutation,
  Args,
  Float,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { CartService } from './cart.service';
import { Cart } from './entities/cart.entity';
import { CreateCartInput } from './dto/create-cart.input';
import { RoleEnum } from 'src/core/enums/role.enum';
import { Roles } from 'src/core/helper/decorators/role.mata.decorator';
import { Inject, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/user/guard/auth.guard';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { User } from 'src/user/entities/user.entity';
import { UserLoader } from 'src/user/loader/users.loader';
import { CartItem } from 'src/cart-item/entities/cart-item.entity';
import { PaginationInput } from 'src/core/helper/pagination/paginatoin-input';
import { CartItemLoader } from 'src/cart-item/loaders/cart.items.loader';
import { PaginatedCartResponse } from './entities/paginated.cart.response';

@Resolver(() => Cart)
export class CartResolver {
  constructor(
    private readonly cartService: CartService,
    @Inject(UserLoader) private readonly userLoader: UserLoader,
    private readonly cartItemLoader: CartItemLoader,
  ) {}

  @Roles(RoleEnum.superAdmin)
  @UseGuards(AuthGuard, RolesGuard)
  @Mutation(() => Cart)
  async createCart(@Args('createCartInput') createCartInput: CreateCartInput) {
    return await this.cartService.create(createCartInput);
  }

  @Query(() => Cart, { name: 'cartById' })
  async findOne(@Args('id', { type: () => String }) id: string) {
    return await this.cartService.findOne(id);
  }
  @UseGuards(AuthGuard)
  @Query(() => Cart, { name: 'cartByUserId' })
  async v(@Args('user_Id', { type: () => String }) id: string) {
    return await this.cartService.findCartByUserId(id);
  }
  @Roles(RoleEnum.superAdmin)
  @UseGuards(AuthGuard, RolesGuard)
  @Query(() => PaginatedCartResponse, { name: 'allCarts', nullable: true })
  async findAllCarts(
    @Args('paginate', { nullable: true }) paginate: PaginationInput,
  ) {
    return await this.cartService.findAllCarts(paginate);
  }

  @Mutation(() => Cart)
  async removeCart(@Args('id', { type: () => String }) id: string) {
    return await this.cartService.remove(id);
  }
  @ResolveField(() => User, { nullable: true })
  async user(@Parent() cart: Cart) {
    console.log('UserUserUser', cart);
    if (!cart.user_id) return null;
    return this.userLoader.loader().load(cart.user_id);
  }
  @ResolveField(() => CartItem, { nullable: true })
  async cartItems(@Parent() cart: Cart) {
    console.log('CartItemCartItem', cart.cartItems);
    if (!cart.cartItems) return null;

    const cartItems = cart.cartItems.filter((item) => item.id !== null);

    if (!cartItems || cartItems.length === 0) return null;
    return this.cartItemLoader
      .loader()
      .loadMany(cartItems.map((item) => item.id));
  }
}
