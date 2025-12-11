import DataLoader from 'dataloader';
import { DataSource, In } from 'typeorm';
import { Cart } from '../entities/cart.entity';

export const cartLoader = (dataSource: DataSource) => {
  return new DataLoader<string, Cart>(async (ids: string[]) => {
    const cart = await dataSource.getRepository(Cart).find({
      relations: ['cartItems', 'cartItems.product', 'cartItems.vendor', 'user'],
      where: { id: In(ids) },
    });
    console.log('ca-----rt', cart);
    const mappedItems = cart.reduce(
      (acc, cart) => {
        acc[cart.id] = cart;
        return acc;
      },
      {} as Record<string, Cart>,
    );
    return ids.map((id) => mappedItems[id]);
  });
};
