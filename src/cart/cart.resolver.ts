import { Resolver, Query, Mutation, Args, Float, ResolveField, Parent } from '@nestjs/graphql';
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

@Resolver(() => Cart)
export class CartResolver {
  cartLoader: DataLoader<string, Cart>;
  constructor(private readonly cartService: CartService, dataSource: DataSource) {
    this.cartLoader = cartLoader(dataSource);
  }

  @Mutation(() => Cart)
  async createCart(@Args('createCartInput') createCartInput: CreateCartInput) {
    return await this.cartService.create(createCartInput);
  }

  @Query(() => Cart, { name: 'cartById' })
  async findOne(@Args('id', { type: () => String }) id: string) {
    return await this.cartService.findOne(id);
  }

  @Roles(RoleEnum.superAdmin)
  @UseGuards(AuthGuard, RolesGuard)
  @Query(() => [Cart], { name: 'allCarts' })
  async findAll() {
    return await this.cartService.findAll();
  }

  @Query(() => Float, { name: 'cartTotal' })
  async getCartTotal(@Args('id', { type: () => String }) id: string) {
    return await this.cartService.getCartTotal(id);
  }

  @Mutation(() => Cart)
  async removeCart(@Args('id', { type: () => String }) id: string) {
    return await this.cartService.remove(id);
  }
  @ResolveField(() => Cart)
  async cartItemsLoader(@Parent() cart: Cart) {
    console.log("fhd------==-=--=-------")
    return this.cartLoader.loadMany(cart.id);
  }
}
