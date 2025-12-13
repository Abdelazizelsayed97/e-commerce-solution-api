import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductInput } from './dto/create-product.input';
import { UpdateProductInput } from './dto/update-product.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Product } from './entities/product.entity';
import { PaginatedProduct } from './entities/paginated.product';
import { PaginationInput } from 'src/core/helper/pagination/paginatoin-input';
import { Follower } from 'src/followers/entities/follower.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    @InjectRepository(Follower)
    private followersRepository: Repository<Follower>,
  ) {}

  async AddProduct(createProductInput: CreateProductInput) {
    const isExist = await this.productsRepository.findOne({
      where: {
        name: createProductInput.name,
      },
    });
    if (isExist) {
      throw new NotFoundException('product already exist');
    }
    const product = this.productsRepository.create({
      ...createProductInput,
      inStock: createProductInput.stock || 0,
      vendor: { id: createProductInput.vendorId },
    });

    return await this.productsRepository.save(product);
  }

  async findAll(
    paginate: PaginationInput,
    SortByPurchuse?: boolean,
  ): Promise<PaginatedProduct> {
    const skip = (paginate.page - 1) * paginate.limit;

    if (SortByPurchuse) {
      const [items, totalItems] = await this.productsRepository.findAndCount({
        relations: {
          vendor: {
            user: true,
            products: true,
          },
        },
        order: {
          purchuseCount: 'DESC',
        },
        skip,
        take: paginate.limit,
      });
      return {
        items,
        pagination: {
          totalItems,
          itemCount: items.length,
          itemsPerPage: paginate.limit,
          totalPages: Math.ceil(totalItems / paginate.limit),
          currentPage: paginate.page,
        },
      };
    }
    const [items, totalItems] = await this.productsRepository.findAndCount({
      skip,
      take: paginate.limit,
      relations: {
        vendor: true,
      },
    });

    return {
      items,
      pagination: {
        totalItems,
        itemCount: items.length,
        itemsPerPage: paginate.limit,
        totalPages: Math.ceil(totalItems / paginate.limit),
        currentPage: paginate.page,
      },
    };
  }
  async getVendorProducts(vendorId: string, paginate: PaginationInput) {
    const skip = (paginate.page - 1) * paginate.limit;
    const limit = paginate.limit;
    const [items, count] = await this.productsRepository.findAndCount({
      where: { vendor: { id: vendorId } },
      skip,
      take: limit,
      order: { addedAt: 'DESC' },
      relations: {
        vendor: {
          user: true,
          products: true,
        },
      },
    });

    return {
      items: items,
      pagination: {
        totalItems: count,
        itemCount: items.length,
        itemsPerPage: limit,
        totalPages: Math.ceil(count / limit),
        currentPage: paginate.page,
      },
    };
  }

  async getFollowedVendorProducts(
    userId: string,
    paginate: PaginationInput,
  ): Promise<PaginatedProduct> {
    const followedVendors = await this.followersRepository.find({
      where: { follower: { id: userId } },
      relations: { vendor: true },
    });

    if (!followedVendors.length) {
      return {
        items: [],
        pagination: {
          totalItems: 0,
          itemCount: 0,
          itemsPerPage: paginate.limit,
          totalPages: 0,
          currentPage: paginate.page,
        },
      };
    }

    const vendorIds = followedVendors.map((f) => f.vendor.id);
    const skip = (paginate.page - 1) * paginate.limit;

    const [items, totalItems] = await this.productsRepository.findAndCount({
      where: { vendor: { id: In(vendorIds) } },
      relations: {
        vendor: {
          user: true,
          products: true,
        },
      },
      skip,
      take: paginate.limit,
      order: { addedAt: 'DESC' },
    });

    return {
      items,
      pagination: {
        totalItems,
        itemCount: items.length,
        itemsPerPage: paginate.limit,
        totalPages: Math.ceil(totalItems / paginate.limit),
        currentPage: paginate.page,
      },
    };
  }

  async findOne(id: string) {
    const isExist = await this.productsRepository.findOne({
      where: {
        id,
      },
    });
    if (isExist) {
      return isExist;
    } else {
      throw new NotFoundException('product not found');
    }
  }

  async update(id: string, updateProductInput: UpdateProductInput) {
    const isExist = await this.findOne(id);
    if (!isExist) {
      throw new NotFoundException('product not found');
    }
    Object.assign(isExist, updateProductInput);
    return await this.productsRepository.save(isExist);
  }

  async remove(id: string) {
    await this.productsRepository.delete(id);
    return {
      success: true,
      message: `This action removes a #${id} product`,
    };
  }
}
