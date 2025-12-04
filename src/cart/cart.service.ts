import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCartInput } from './dto/create-cart.input';

import { InjectRepository } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import { Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';
import { CartItemService } from 'src/cart_item/cart_item.service';
import { addToCartInput } from './dto/add-to-cart';
import { CartItem } from 'src/cart_item/entities/cart_item.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
    private readonly userService: UserService,
    @InjectRepository(CartItem)
    private readonly cartItemRepository: Repository<CartItem>,
  ) {}
  async create(createCartInput: CreateCartInput): Promise<Cart> {
    const isCartExist = await this.cartRepository.findOne({
      where: { id: createCartInput.userId },
    });
    if (isCartExist) {
      return isCartExist;
    } else {
      const cart = this.cartRepository.create({
        userId: await this.userService.findOne(createCartInput.userId),
      });
      return await this.cartRepository.save(cart);
    }
  }
  async addTocart(addToCart: addToCartInput) {
    const isExist = await this.findOne(addToCart.cartId);
    if (!isExist) {
      throw new NotFoundException('cart not found');
    }
    Object.assign(isExist, addToCart);
    return this.cartRepository.save(isExist);
  }
  async findAll() {
    return await this.cartRepository.find();
  }

  async findOne(id: string) {
    const cart = await this.cartRepository.findOne({ where: { id: id } });
    if (!cart) {
      throw new NotFoundException('cart not found');
    }
    return cart;
  }

  async remove(id: string) {
    return await this.cartRepository.delete(id);
  }
}
