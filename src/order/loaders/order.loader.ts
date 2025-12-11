
import DataLoader from 'dataloader';
import { In, Repository } from 'typeorm';
import { Order } from '../entities/order.entity';

export function OrderLoader(orderRepo: Repository<Order>) {
  return new DataLoader<string, Order>(async (ids) => {
    const orders = await orderRepo.find({
      where: { id: In(ids as string[]) },
      relations: {
        client: true,
        cart: true,
         orderItems: true,
      },
    });

    const map = new Map(orders.map((o) => [o.id, o]));

    return ids.map((id) => {
      const order = map.get(id);
      return order ?? new Error(`Order not found: ${id}`);
    });
  });
}
