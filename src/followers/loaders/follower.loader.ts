import DataLoader from 'dataloader';
import { In, Repository } from 'typeorm';
import { Follower } from '../entities/follower.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { RequestScoped } from 'src/core/loader.decorator';

@RequestScoped()
export class FollowerLoader {
  constructor(
    @InjectRepository(Follower)
    private readonly followerRepo: Repository<Follower>,
  ) {}

  loader() {
    return new DataLoader<string, Follower>(async (ids) => {
      const followers = await this.followerRepo.find({
        where: { id: In(ids as string[]) },
        relations: {
          vendor: true,
          user: true,
        },
      });

      const map = new Map<string, Follower>();
      followers.forEach((item)=>map.set(item.id, item));

      return ids.map((id) => {
        const follower = map.get(id);
        return follower ?? new Error(`Follower not found: ${id}`);
      });
    });
  }
}
