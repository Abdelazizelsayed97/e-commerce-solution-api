import { Resolver, Query, Mutation, Args, Float } from '@nestjs/graphql';
import { CartService } from './cart.service';
import { Cart } from './entities/cart.entity';
import { CreateCartInput } from './dto/create-cart.input';

@Resolver(() => Cart)
export class CartResolver {
  constructor(private readonly cartService: CartService) {}

  @Mutation(() => Cart)
  async createCart(@Args('createCartInput') createCartInput: CreateCartInput) {
    return await this.cartService.create(createCartInput);
  }

  @Query(() => Cart, { name: 'cartById' })
  async findOne(@Args('id', { type: () => String }) id: string) {
    return await this.cartService.findOne(id);
  }

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
}
