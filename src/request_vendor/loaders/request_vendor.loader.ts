import { InjectRepository } from '@nestjs/typeorm';
import DataLoader from 'dataloader';
import { RequestScoped } from 'src/core/loader.decorator';
import { RequestVendor } from '../entities/request_vendor.entity';
import { In, Repository } from 'typeorm';

@RequestScoped()
export class VendorRequestLoader {
  constructor(
    @InjectRepository(RequestVendor)
    private readonly vendorRequestRepository: Repository<RequestVendor>,
  ) {}
  loader() {
    return new DataLoader(async (ids: string[]) => {
      const result = await this.vendorRequestRepository.find({
        where: { id: In(ids) },
      });
      const mappedItem = new Map<string, RequestVendor>();
      result.forEach((item) => mappedItem.set(item.id, item));
      return ids.map((id) => mappedItem.get(id) || null);
    });
  }
}
