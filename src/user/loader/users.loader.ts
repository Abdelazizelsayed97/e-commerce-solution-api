import DataLoader from 'dataloader';
import { In, Repository } from 'typeorm';
import { User } from '../entities/user.entity';

import { InjectRepository } from '@nestjs/typeorm';
import { RequestScoped } from 'src/core/loader.decorator';

@RequestScoped()
export class UserLoader {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  loader() {
    return new DataLoader<string, User>(async (ids) => {
      console.log('idessssss', ids);
      const users = await this.userRepo.find({
        where: { id: In(ids) },
      });

      const map = new Map(users.map((u) => [u.id, u]));

      return ids.map((id) => {
        const user = map.get(id);
        return user ?? new Error(`User not found: ${id}`);
      });
    });
  }
}
