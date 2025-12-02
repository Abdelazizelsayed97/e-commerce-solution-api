import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/product/entities/product.entity';
import { Vendor } from 'src/vendor/entities/vendor.entity';
import { DataSource, ILike, Repository } from 'typeorm';
import { SearchInput } from './dto/search.input';
import { PaginatedSearch } from './entities/search.entity';

@Injectable()
export class SearchService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Vendor)
    private readonly vendorRepository: Repository<Vendor>,
  ) {}

  async search(searchInput: SearchInput): Promise<PaginatedSearch> {
    const { searchKey, page, limit } = searchInput;
    const skip = (page - 1) * limit;

    const [products, productsCount] = await this.productRepository.findAndCount(
      {
        where: { name: ILike(`%${searchKey}%`) },
      },
    );

    const [vendors, vendorsCount] = await this.vendorRepository.findAndCount({
      where: { shopName: ILike(`%${searchKey}%`) },
    });

    const allItems = [...products, ...vendors];
    const totalItems = productsCount + vendorsCount;

    const paginatedItems = allItems.slice(skip, skip + limit);

    return {
      items: paginatedItems,
      pagination: {
        totalItems,
        itemCount: paginatedItems.length,
        itemsPerPage: limit,
        totalPages: Math.ceil(totalItems / limit),
        currentPage: page,
      },
    };
  }
}
