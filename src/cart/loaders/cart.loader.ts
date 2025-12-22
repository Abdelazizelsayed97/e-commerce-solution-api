import DataLoader from 'dataloader';
import { In, Repository } from 'typeorm';
import { Cart } from '../entities/cart.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { RequestScoped } from 'src/core/loader.decorator';

@RequestScoped()
export class CartLoader {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepo: Repository<Cart>,
  ) {}
  loader() {
    return new DataLoader<string, Cart>(async (ids: string[]) => {
      const cart = await this.cartRepo.find({
        where: { id: In(ids) },
      });

      const itemsAsMap = new Map<string, Cart>();
      cart.forEach((item) => {
        itemsAsMap.set(item.id, item);
      });

      return ids.map((id) => itemsAsMap.get(id) ?? new Cart());
    });
  }
}
