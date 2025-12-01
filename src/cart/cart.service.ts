import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCartInput } from './dto/create-cart.input';
import { UpdateCartInput } from './dto/update-cart.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import { Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
    private readonly userService: UserService,
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
        createAt: createCartInput.createAt,
        updateAt: createCartInput.updateAt,
      });
      return await this.cartRepository.save(cart);
    }
  }

  async findOne(id: string) {
    const cart = await this.cartRepository.findOne({ where: { id: id } });
    if (!cart) {
      throw new NotFoundException('cart not found');
    }
    return cart;
  }

  async update(id: string, updateCartInput: UpdateCartInput) {
    const isExist = await this.findOne(id);
    if (!isExist) {
      throw new NotFoundException('cart not found');
    }
    Object.assign(isExist, updateCartInput);
    return this.cartRepository.save(isExist);
  }

  async remove(id: string) {
    return await this.cartRepository.delete(id);
  }
}
