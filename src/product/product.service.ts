import { Injectable, NotFoundException, Scope } from '@nestjs/common';
import { CreateProductInput } from './dto/create-product.input';
import { UpdateProductInput } from './dto/update-product.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Product } from './entities/product.entity';
import { PaginatedProduct } from './entities/paginated.product';
import { PaginationInput } from 'src/core/helper/pagination/paginatoin-input';
import { Follower } from 'src/followers/entities/follower.entity';
import { User } from 'src/user/entities/user.entity';
import { RoleEnum } from 'src/core/enums/role.enum';

@Injectable({
  scope: Scope.REQUEST,
})
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
      categoryId: createProductInput.categoryId,
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
      order: { createdAt: 'DESC' },
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
      order: { createdAt: 'DESC' },
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

  async update(
    id: string,
    updateProductInput: UpdateProductInput,
    user?: User,
  ) {
    const product = await this.productsRepository.findOne({
      where: { id },
      relations: { vendor: { user: true } },
    });

    if (!product) {
      throw new NotFoundException('product not found');
    }

    if (user?.role !== RoleEnum.vendor || product.vendor?.user.id !== user.id) {
      throw new NotFoundException('You can only update your own products');
    }

    Object.assign(product, updateProductInput);
    return await this.productsRepository.save(product);
  }

  async remove(id: string, user?: User) {
    const product = await this.productsRepository.findOne({
      where: { id },
      relations: { vendor: { user: true } },
    });

    if (!product) {
      throw new NotFoundException('product not found');
    }

    // Check ownership - only vendor who owns the product or super admin can delete
    if (user && user.role !== RoleEnum.superAdmin) {
      if (
        user.role !== RoleEnum.vendor ||
        product.vendor?.user.id !== user.id
      ) {
        throw new NotFoundException('You can only delete your own products');
      }
    }

    await this.productsRepository.delete(id);
    return {
      success: true,
      message: `This action removes a #${id} product`,
    };
  }
}
