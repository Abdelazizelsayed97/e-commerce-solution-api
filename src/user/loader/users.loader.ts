import DataLoader from 'dataloader';
import { In, Repository } from 'typeorm';
import { User } from '../entities/user.entity';

export function UserLoader(userRepo: Repository<User>) {
  return new DataLoader<string, User>(async (ids) => {
    const users = await userRepo.find({
      where: { id: In(ids as string[]) },
    });

    const map = new Map(users.map((u) => [u.id, u]));

    return ids.map((id) => {
      const user = map.get(id);
      return user ?? new Error(`User not found: ${id}`);
    });
  });
}
