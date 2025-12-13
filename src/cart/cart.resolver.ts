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

@Resolver(() => Cart)
export class CartResolver {
  cartLoader: DataLoader<string, Cart>;
  userLoader: DataLoader<string, User>;
  constructor(
    private readonly cartService: CartService,
    dataSource: DataSource,
  ) {
    this.cartLoader = cartLoader(dataSource);
    this.userLoader = UserLoader(dataSource.getRepository(User));
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
  @ResolveField(() => User)
  async cartItemsLoader(@Parent() cart: Cart) {
    if (!cart) return null;
    console.log('cartcartcart', cart);
    return this.cartLoader.load(cart.id);
  }
  @ResolveField(() => User, { nullable: true })
  async user(@Parent() cart: Cart) {
    console.log('cartcartcart', cart);
    if (!cart.user) return null;
    return this.userLoader.loadMany([cart.user.id]);
  }
  @ResolveField(() => CartItem, { nullable: true })
  async cartItems(@Parent() cart: Cart) {
    console.log('cartcartcart', cart);
    if (!cart.cartItems) return null;
    return this.cartLoader.load(cart.id);
  }
}
