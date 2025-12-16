import DataLoader from 'dataloader';
import { DataSource, In } from 'typeorm';
import { Cart } from '../entities/cart.entity';

export const cartLoader = (dataSource: DataSource) => {
  return new DataLoader<string, Cart>(async (ids: string[]) => {
    const cart = await dataSource.getRepository(Cart).find({
      where: { id: In(ids) },
    });

    const itemsAsMap = new Map<string, Cart>();
    cart.forEach((cart) => {
      itemsAsMap.set(cart.id, cart);
    });

    return ids.map((id) => itemsAsMap.get(id) ?? new Cart());
  });
};
