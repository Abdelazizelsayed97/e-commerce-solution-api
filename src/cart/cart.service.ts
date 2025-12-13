import {
  Injectable,
  NotFoundException,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { CreateCartInput } from './dto/create-cart.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import { Repository } from 'typeorm';

import { CartItem } from 'src/cart_item/entities/cart_item.entity';
import { User } from 'src/user/entities/user.entity';
import { PaginationInput } from 'src/core/helper/pagination/paginatoin-input';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(CartItem)
    private readonly cartItemRepository: Repository<CartItem>,
  ) {}

  async create(createCartInput: CreateCartInput): Promise<Cart> {
    const isCartExist = await this.cartRepository.findOne({
      where: { user: { id: createCartInput.userId } },
    });
    if (isCartExist) {
      return isCartExist;
    } else {
      const user = await this.userRepository.findOne({
        where: { id: createCartInput.userId },
      });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      const cart = this.cartRepository.create({
        ...user,
      });
      return await this.cartRepository.save(cart);
    }
  }

  async findAll(paginate: PaginationInput): Promise<Cart[]> {
    console.log('paginate', paginate);
    return await this.cartRepository.find({
      relations: ['cartItems', 'cartItems.product', 'cartItems.vendor'],
    });
  }

  async findOne(id: string) {
    const cart = await this.cartRepository.findOne({
      where: { id: id },
      relations: ['cartItems', 'cartItems.product', 'cartItems.vendor'],
    });
    if (!cart) {
      throw new NotFoundException('cart not found');
    }
    return cart;
  }

  async findCartByUserId(userId: string) {
    const cart = await this.cartRepository.findOne({
      where: { user: { id: userId } },
      // relations: {
      //   user: true,
      // },
    });
    if (!cart) {
      throw new NotFoundException('cart not found');
    }

    return cart;
  }

  async getCartTotal(id: string): Promise<number> {
    const cart = await this.findOne(id);
    if (!cart.cartItems || cart.cartItems.length === 0) {
      return 0;
    }
    return cart.cartItems.reduce((sum, item) => sum + item.totlePrice, 0);
  }

  async remove(id: string) {
    const cart = await this.findOne(id);
    return await this.cartRepository.remove(cart);
  }
}
