import { Injectable } from '@nestjs/common';
import { CreateCartItemInput } from './dto/create-cart_item.input';
import { UpdateCartItemInput } from './dto/update-cart_item.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CartItem } from './entities/cart_item.entity';
import { CartService } from 'src/cart/cart.service';

@Injectable()
export class CartItemService {
  constructor(
    @InjectRepository(CartItem)
    private readonly cartItemRepository: Repository<CartItem>,
    private readonly cartService: CartService,
  ) {}
  async addItemToCart(createCartItemInput: CreateCartItemInput) {
    const cart = this.cartService.findOne(createCartItemInput.cartId);
    if (!cart) {
      const cart = await this.cartService.create({
        userId: createCartItemInput.userId,
      });
      createCartItemInput.cartId = cart.id;
    }
    return await this.cartItemRepository.save(createCartItemInput);
  }

  findAll() {
    return `This action returns all cartItem`;
  }

  findOne(id: number) {
    return `This action returns a #${id} cartItem`;
  }

  update(id: number, updateCartItemInput: UpdateCartItemInput) {
    return `This action updates a #${id} cartItem`;
  }

  remove(id: number) {
    return `This action removes a #${id} cartItem`;
  }
}
