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
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/user/guard/auth.guard';
import { RolesGuard } from 'src/auth/guards/role.guard';
import DataLoader from 'dataloader';
import { DataSource } from 'typeorm';
import { cartLoader } from './loaders/cart.loader';
import { User } from 'src/user/entities/user.entity';
import { UserLoader } from 'src/user/loader/users.loader';
import { CartItem } from 'src/cart_item/entities/cart_item.entity';
import { PaginationInput } from 'src/core/helper/pagination/paginatoin-input';
import { cartItemLoader } from 'src/cart_item/loaders/cart.items.loader';

@Resolver(() => Cart)
export class CartResolver {
  cartLoader: DataLoader<string, Cart>;
  userLoader: DataLoader<string, User>;
  cartItemLoader: DataLoader<string, CartItem>;
  constructor(
    private readonly cartService: CartService,
    dataSource: DataSource,
  ) {
    this.cartLoader = cartLoader(dataSource);
    this.userLoader = UserLoader(dataSource.getRepository(User));
    this.cartItemLoader = cartItemLoader(dataSource);
  }

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
  @Query(() => [Cart], { name: 'allCarts' })
  async findAll(
    @Args('paginate', { nullable: true }) paginate: PaginationInput,
  ) {
    return await this.cartService.findAll(paginate);
  }

  @Query(() => Float, { name: 'cartTotal' })
  async getCartTotal(@Args('id', { type: () => String }) id: string) {
    return await this.cartService.getCartTotal(id);
  }

  @Mutation(() => Cart)
  async removeCart(@Args('id', { type: () => String }) id: string) {
    return await this.cartService.remove(id);
  }
  @ResolveField(() => User, { nullable: true })
  async user(@Parent() cart: Cart) {
    console.log('UserUserUser', cart);
    if (!cart.user) return null;
    return this.userLoader.load(cart.user.id);
  }
  @ResolveField(() => CartItem, { nullable: true })
  async cartItems(@Parent() cart: Cart) {
    console.log('CartItemCartItem', cart.cartItems);
    if (!cart.cartItems) return null;

    const cartItems = cart.cartItems.filter((item) => item.id !== null);

    if (!cartItems || cartItems.length === 0) return null;
    return this.cartItemLoader.loadMany(cartItems.map((item) => item.id));
  }
}
