import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/product/entities/product.entity';
import { Vendor } from 'src/vendor/entities/vendor.entity';
import { ILike, Repository, Between } from 'typeorm';
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
    const { searchKey, page, limit, category, minPrice, maxPrice } =
      searchInput;
    const skip = (page - 1) * limit;

    console.log(searchInput);
    const productWhere: any = { name: ILike(`%${searchKey}%`) };
    if (category) {
      productWhere.category = category;
    }

    if (minPrice !== undefined && maxPrice !== undefined) {
      productWhere.price = Between(minPrice, maxPrice);
    } else if (minPrice !== undefined) {
      productWhere.price = Between(minPrice, Number.MAX_SAFE_INTEGER);
    } else if (maxPrice !== undefined) {
      productWhere.price = Between(0, maxPrice);
    }

    const [products, productsCount] = await this.productRepository.findAndCount(
      {
        where: productWhere,
      },
    );

    const [vendors, vendorsCount] = await this.vendorRepository.findAndCount({
      where: { shopName: ILike(`%${searchKey}%`) },
    });

    const allItems = [...products, ...vendors];
    const totalItemsCount = productsCount + vendorsCount;

    const paginatedItems = allItems.slice(skip, skip + limit);

    return {
      items: paginatedItems,
      pagination: {
        totalItems: totalItemsCount,
        itemCount: paginatedItems.length,
        itemsPerPage: limit,
        totalPages: Math.ceil(totalItemsCount / limit),
        currentPage: page,
      },
    };
  }
}
