import DataLoader from 'dataloader';
import { In, Repository } from 'typeorm';
import { Fcm } from '../entities/fcm.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { RequestScoped } from 'src/core/loader.decorator';

@RequestScoped()
export class FcmLoader {
  constructor(
    @InjectRepository(Fcm)
    private readonly fcmRepo: Repository<Fcm>,
  ) {}

  loader() {
    return new DataLoader<string, Fcm>(async (ids) => {
      const fcms = await this.fcmRepo.find({
        where: { id: In(ids as string[]) },
        relations: {
          user: true,
        },
      });

      const map = new Map(fcms.map((f) => [f.id, f]));

      return ids.map((id) => {
        const fcm = map.get(id);
        return fcm ?? new Error(`Fcm not found: ${id}`);
      });
    });
  }
}
