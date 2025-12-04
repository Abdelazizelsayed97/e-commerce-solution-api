import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { CartService } from './cart.service';
import { Cart } from './entities/cart.entity';
import { CreateCartInput } from './dto/create-cart.input';
import { addToCartInput } from './dto/add-to-cart';

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

  @Mutation(() => Cart, { name: 'addToCart' })
  async addTocart(@Args('addTocartInput') updateCartInput: addToCartInput) {
    return await this.cartService.addTocart(updateCartInput);


    
  }

  @Mutation(() => Cart)
  async removeCart(@Args('id', { type: () => String }) id: string) {
    return await this.cartService.remove(id);
  }
}
