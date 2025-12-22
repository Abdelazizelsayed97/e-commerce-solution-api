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
import { Category } from 'src/category/entities/category.entity';
import { EmailService } from 'src/email/email.service';
import { Cart } from 'src/cart/entities/cart.entity';

@Injectable({
  scope: Scope.REQUEST,
})
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    @InjectRepository(Follower)
    private followersRepository: Repository<Follower>,

    @InjectRepository(Category)
    private catRepo: Repository<Category>,
    private readonly emailService: EmailService,
    @InjectRepository(Cart)
    private readonly cartRepo: Repository<Cart>,
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
    const category = await this.catRepo.findOne({
      where: {
        id: createProductInput.categoryId,
      },
    });

    if (!category) {
      throw new Error('this catrgory doesnt exist ');
    }

    const product = this.productsRepository.create({
      ...createProductInput,
      inStock: createProductInput.stock || 0,
      vendor: { id: createProductInput.vendorId },
      categoryId: category.id,
    });

    return await this.productsRepository.save(product);
  }

  async findAllProducts(paginate: PaginationInput, SortByPurchuse?: boolean) {
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
        items: items,
        total: totalItems,
        limit: paginate.limit,
        page: paginate.page,
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
      page: paginate.page,
      limit: paginate.limit,
      total: count,
    };
  }

  async getFollowedVendorProducts(
    userId: string,
    paginate: PaginationInput,
  ): Promise<PaginatedProduct> {
    const [followedVendors, totalFollowedVendors] =
      await this.followersRepository.findAndCount({
        where: { user: { id: userId } },
        relations: { vendor: true },
      });

    if (totalFollowedVendors === 0) {
      return {
        items: [],
        page: paginate.page,
        limit: paginate.limit,
        total: 0,
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
      items: items,
      page: paginate.page,
      limit: paginate.limit,
      total: totalItems,
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
    const updatedProduct = await this.productsRepository.save(product);
    const users = await this.cartRepo.find({
      where: { cartItems: { product_id: id } },
    });
    users.forEach(async (user) => {
      await this.emailService.sendStatusNotification(
        user,
        updatedProduct.name,
        product.name,
      );
    });
    return updatedProduct;
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
