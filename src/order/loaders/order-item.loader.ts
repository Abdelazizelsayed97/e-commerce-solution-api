import DataLoader from 'dataloader';
import { In, Repository } from 'typeorm';
import { OrderItem } from '../entities/order-item.entity';

export function OrderItemLoader(orderItemRepo: Repository<OrderItem>) {
  return new DataLoader<string, OrderItem[]>(
    async (orderIds: readonly string[]) => {
      const orderItems = await orderItemRepo.find({
        where: {
          id: In(orderIds as string[]),
        },
      });

      const orderItemMap = new Map<string, OrderItem[]>();
      orderIds.forEach((orderId) => {
        orderItemMap.set(orderId, []);
      });

      orderItems.forEach((item) => {
        const items = orderItemMap.get(item.id) || [];
        items.push(item);
        orderItemMap.set(item.id, items);
      });

      return orderIds.map((orderId) => orderItemMap.get(orderId) || []);
    },
  );
}
