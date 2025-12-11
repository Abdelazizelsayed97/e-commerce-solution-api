import DataLoader from 'dataloader';
import { In, Repository } from 'typeorm';
import { Fcm } from '../entities/fcm.entity';

export function FcmLoader(fcmRepo: Repository<Fcm>) {
  return new DataLoader<string, Fcm>(async (ids) => {
    const fcms = await fcmRepo.find({
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
