import DataLoader from 'dataloader';
import { In, Repository } from 'typeorm';
import { Follower } from '../entities/follower.entity';

export function FollowerLoader(followerRepo: Repository<Follower>) {
  return new DataLoader<string, Follower>(async (ids) => {
    const followers = await followerRepo.find({
      where: { id: In(ids as string[]) },
      relations: {
        vendor: true,
        follower: true,
      },
    });

    const map = new Map(followers.map((f) => [f.id, f]));

    return ids.map((id) => {
      const follower = map.get(id);
      return follower ?? new Error(`Follower not found: ${id}`);
    });
  });
}
