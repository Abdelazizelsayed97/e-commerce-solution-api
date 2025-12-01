import DataLoader from 'dataloader';
import { DataSource } from 'typeorm';
import { Vendor } from 'src/vendor/entities/vendor.entity';
import { User } from 'src/user/entities/user.entity';

export const VendorUserLoader = (dataSource: DataSource) => {
  return new DataLoader<string, User | null>(
    async (vendorIds: readonly string[]) => {
      const vendors = await dataSource
        .getRepository(Vendor)
        .createQueryBuilder('vendor')
        .where('vendor.id IN (:...vendorIds)', { vendorIds: [...vendorIds] })
        .leftJoinAndSelect('vendor.user', 'user')
        .getMany();

      const vendorMap = new Map<string, User>();
      vendors.forEach((vendor) => {
        if (vendor.user) {
          vendorMap.set(vendor.id, vendor.user);
        }
      });

      return vendorIds.map((id) => vendorMap.get(id) || null);
    },
  );
};
