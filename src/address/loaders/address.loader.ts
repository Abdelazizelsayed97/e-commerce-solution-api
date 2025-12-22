import DataLoader from 'dataloader';
import { In, Repository } from 'typeorm';
import { Address } from '../entities/address.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { RequestScoped } from 'src/core/loader.decorator';

@RequestScoped()
export class AddressLoader {
  constructor(
    @InjectRepository(Address)
    private readonly addressRepo: Repository<Address>,
  ) {}

  loader() {
    return new DataLoader<string, Address>(async (ids: string[]) => {
      const addresses = await this.addressRepo.find({
        where: { id: In(ids) },
      });

      const map = new Map(addresses.map((a) => [a.id, a]));

      return ids.map((id) => {
        const address = map.get(id);
        return address ?? new Error(`Address not found: ${id}`);
      });
    });
  }
}
