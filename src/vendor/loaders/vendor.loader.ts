import DataLoader from 'dataloader';
import { In, Repository } from 'typeorm';
import { Vendor } from 'src/vendor/entities/vendor.entity';

export function VendorLoader(vendorRepo: Repository<Vendor>) {
  return new DataLoader<string, Vendor>(
    async (ids: readonly string[]) => {
    console.log('VendorLoader - ids', ids);
    // const data = await vendorRepo
    //   .createQueryBuilder('vendor')
    //   .leftJoinAndSelect('vendor.user', 'user')
    //   .where('vendor.id IN (:...ids)', { ids })
    //   .getMany();

    const data = await vendorRepo.find({
      where: { id: In(ids) },
    });

    const vendorMap = new Map<string, Vendor>();
    data.forEach((vendor) => {
      vendorMap.set(vendor.id, vendor);
    });
    return ids.map((id) => vendorMap.get(id)!);
  });
} 
