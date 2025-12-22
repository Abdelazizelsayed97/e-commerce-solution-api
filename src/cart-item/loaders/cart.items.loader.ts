import DataLoader from 'dataloader';
import { In, Repository } from 'typeorm';
import { CartItem } from '../entities/cart-item.entity';
import { InjectRepository } from '@nestjs/typeorm';

import { RequestScoped } from 'src/core/loader.decorator';

@RequestScoped()
export class CartItemLoader {
  constructor(
    @InjectRepository(CartItem)
    private readonly cartItemRepo: Repository<CartItem>,
  ) {}

  loader() {
    return new DataLoader<string, CartItem>(async (ids: string[]) => {
      const cartItems = await this.cartItemRepo.find({
        where: { id: In(ids) },
        relations: ['product', 'vendor', 'cart'],
      });
      const mappedItems = cartItems.reduce(
        (acc, cartItem) => {
          acc[cartItem.id] = cartItem;
          return acc;
        },
        {} as Record<string, CartItem>,
      );
      return ids.map((id) => mappedItems[id]);
    });
  }
}
