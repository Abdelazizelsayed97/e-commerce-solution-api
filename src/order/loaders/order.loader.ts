import DataLoader from 'dataloader';
import { In, Repository } from 'typeorm';
import { Order } from '../entities/order.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { RequestScoped } from 'src/core/loader.decorator';

@RequestScoped()
export class OrderLoader {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
  ) {}

  loader() {
    return new DataLoader<string, Order>(async (ids) => {
      const orders = await this.orderRepo.find({
        where: { id: In(ids as string[]) },
      });

      const map = new Map<string, Order>();

      return ids.map((id) => {
        const order = map.get(id);
        return order ?? new Error(`Order not found: ${id}`);
      });
    });
  }
}
