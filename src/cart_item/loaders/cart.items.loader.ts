import DataLoader from 'dataloader';
import { DataSource, In } from 'typeorm';
import { CartItem } from '../entities/cart_item.entity';

export const cartItemLoader = (dataSource: DataSource) => {
  return new DataLoader<string, CartItem>(async (ids: string[]) => {
    const cartItems = await dataSource.getRepository(CartItem).find({
      where: { id: In(ids) },
      relations: ['product', 'vendor', 'cart'],
    });
    const mappedItems = cartItems.reduce((acc, cartItem) => {
      acc[cartItem.id] = cartItem;
      return acc;
    });
    return ids.map((id) => mappedItems[id]);
  });
};
