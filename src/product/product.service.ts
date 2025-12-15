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

    // Check ownership - only vendor who owns the product or super admin can update
    if (user && user.role !== RoleEnum.superAdmin) {
      if (
        user.role !== RoleEnum.vendor ||
        product.vendor?.user.id !== user.id
      ) {
        throw new NotFoundException('You can only update your own products');
      }
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

  

  async getMostPopularProducts(
    paginate: PaginationInput,
  ): Promise<PaginatedProduct> {
    const skip = (paginate.page - 1) * paginate.limit;

    let dateCondition = '';
    const now = new Date();

    const query = `
      SELECT
        p.*,
        COUNT(oi.id) as order_count,
        SUM(oi.quantity) as total_sold
      FROM products p
      LEFT JOIN order_items oi ON p.id = oi.product_id
      LEFT JOIN orders o ON oi.order_id = o.id AND o.status != 'CANCELLED' ${dateCondition}
      GROUP BY p.id
      HAVING COUNT(oi.id) > 0
      ORDER BY order_count DESC, total_sold DESC
      LIMIT ${paginate.limit} OFFSET ${skip}
    `;

    const countQuery = `
      SELECT COUNT(DISTINCT p.id) as total
      FROM products p
      LEFT JOIN order_items oi ON p.id = oi.product_id
      LEFT JOIN orders o ON oi.order_id = o.id AND o.status != 'CANCELLED' ${dateCondition}
      GROUP BY p.id
      HAVING COUNT(oi.id) > 0
    `;

    const [products, countResult] = await Promise.all([
      this.productsRepository.query(query),
      this.productsRepository.query(countQuery),
    ]);

    const totalItems = countResult.length || 0;

    const productIds = products.map((p) => p.id);
    const items =
      productIds.length > 0
        ? await this.productsRepository.find({
            where: { id: { $in: productIds } } as any,
            relations: { vendor: true },
          })
        : [];

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

  async getMostPopularVendors(
    paginate: PaginationInput,
  ): Promise<{ vendors: any[]; pagination: any }> {
    const skip = (paginate.page - 1) * paginate.limit;

    let dateCondition = '';
    const now = new Date();

    const query = `
      SELECT 
        v.*,
        u.name as user_name,
        u.email as user_email,
        COUNT(DISTINCT p.id) as product_count,
        COUNT(DISTINCT o.id) as order_count,
        SUM(oi.quantity) as total_sold,
        AVG(r.rating) as avg_rating,
        COUNT(DISTINCT r.id) as review_count
      FROM vendors v
      LEFT JOIN users u ON v.user_id = u.id
      LEFT JOIN products p ON v.id = p.vendor_id
      LEFT JOIN order_items oi ON p.id = oi.product_id
      LEFT JOIN orders o ON oi.order_id = o.id AND o.status != 'CANCELLED' ${dateCondition}
      LEFT JOIN rating_and_reviews r ON v.id = r.vendor_id
      GROUP BY v.id, u.name, u.email
      HAVING COUNT(DISTINCT o.id) > 0 OR COUNT(DISTINCT r.id) > 0
      ORDER BY 
        (COUNT(DISTINCT o.id) * 0.6 + AVG(r.rating) * 0.4) DESC,
        COUNT(DISTINCT p.id) DESC
      LIMIT ${paginate.limit} OFFSET ${skip}
    `;

    const countQuery = `
      SELECT COUNT(DISTINCT v.id) as total
      FROM vendors v
      LEFT JOIN products p ON v.id = p.vendor_id
      LEFT JOIN order_items oi ON p.id = oi.product_id
      LEFT JOIN orders o ON oi.order_id = o.id AND o.status != 'CANCELLED' ${dateCondition}
      LEFT JOIN rating_and_reviews r ON v.id = r.vendor_id
      GROUP BY v.id
      HAVING COUNT(DISTINCT o.id) > 0 OR COUNT(DISTINCT r.id) > 0
    `;

    const [vendors, countResult] = await Promise.all([
      this.productsRepository.query(query),
      this.productsRepository.query(countQuery),
    ]);

    const totalItems = countResult.length || 0;

    return {
      vendors,
      pagination: {
        totalItems,
        itemCount: vendors.length,
        itemsPerPage: paginate.limit,
        totalPages: Math.ceil(totalItems / paginate.limit),
        currentPage: paginate.page,
      },
    };
  }
}
