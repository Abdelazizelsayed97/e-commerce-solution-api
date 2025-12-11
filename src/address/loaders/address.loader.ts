import DataLoader from 'dataloader';
import { In, Repository } from 'typeorm';
import { Address } from '../entities/address.entity';

export function AddressLoader(addressRepo: Repository<Address>) {
  return new DataLoader<string, Address>(async (ids) => {
    const addresses = await addressRepo.find({
      where: { id: In(ids as string[]) },
      relations: {
        user: true,
      },
    });

    const map = new Map(addresses.map((a) => [a.id, a]));

    return ids.map((id) => {
      const address = map.get(id);
      return address ?? new Error(`Address not found: ${id}`);
    });
  });
}
