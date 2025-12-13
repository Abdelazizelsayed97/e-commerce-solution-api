import { Injectable } from '@nestjs/common';
import { CreateVendorInput } from './dto/create-vendor.input';
import { UpdateVendorInput } from './dto/update-vendor.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Vendor } from './entities/vendor.entity';
import { UserService } from 'src/user/user.service';
import { PaginationInput } from 'src/core/helper/pagination/paginatoin-input';
import { VendorPaginated } from './entities/vendor.paginated';
import { RatingAndReview } from 'src/rating-and-review/entities/rating-and-review.entity';

@Injectable()
export class VendorService {
  constructor(
    @InjectRepository(Vendor)
    private readonly vendorRepository: Repository<Vendor>,
    @InjectRepository(RatingAndReview)
    private readonly reviewRepository: Repository<RatingAndReview>,
    private readonly userService: UserService,
  ) {}

  async create(createVendorInput: CreateVendorInput) {
    const isExist = await this.vendorRepository.findOne({
      where: {
        user: {
          id: createVendorInput.user_id,
        },
      },
    });

    if (isExist) {
      throw new Error('vendor already exist');
    }
    const user = await this.userService.findOneById(createVendorInput.user_id);
    if (!user) {
      throw new Error('user not found');
    }
    const vendor = this.vendorRepository.create({
      ...createVendorInput,
      user: user,
    });

    return await this.vendorRepository.save(vendor);
  }

  async getAllVendors(paginate: PaginationInput): Promise<VendorPaginated> {
    const skip = (paginate.page - 1) * paginate.limit;
    const [vendors, total] = await this.vendorRepository.findAndCount({
      relations: {
        user: true,
        products: true,
      },
      skip: skip,
      take: paginate.limit,
    });
    return {
      items: vendors,
      pagination: {
        currentPage: paginate.page,
        itemCount: total,
        itemsPerPage: paginate.limit,
        totalPages: Math.ceil(total / paginate.limit),
        totalItems: total,
      },
    };
  }

  async getAverageRating(vendorId: string): Promise<number | null> {
    try {
      const vendor = await this.vendorRepository.findOne({
        where: { id: vendorId },
        relations: { products: true },
      });

      if (!vendor || !vendor.products || vendor.products.length === 0) {
        return null;
      }

      const productIds = vendor.products
        .map((p) => p.id)
        .filter((id): id is string => !!id);

      if (productIds.length === 0) {
        return null;
      }

      const reviews = await this.reviewRepository.find({
        where: {
          product: { id: In(productIds) },
        },
      });

      if (!reviews || reviews.length === 0) {
        return null;
      }

      const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
      return Math.round((totalRating / reviews.length) * 10) / 10;
    } catch (error) {
      console.error(
        `Error calculating average rating for vendor ${vendorId}:`,
        error,
      );
      return null;
    }
  }

  async getReviewCount(vendorId: string): Promise<number> {
    try {
      const vendor = await this.vendorRepository.findOne({
        where: { id: vendorId },
        relations: { products: true },
      });

      if (!vendor || !vendor.products || vendor.products.length === 0) {
        return 0;
      }

      const productIds = vendor.products
        .map((p) => p.id)
        .filter((id): id is string => !!id);

      if (productIds.length === 0) {
        return 0;
      }

      const reviewCount = await this.reviewRepository.count({
        where: {
          product: { id: In(productIds) },
        },
      });

      return reviewCount;
    } catch (error) {
      console.error(
        `Error getting review count for vendor ${vendorId}:`,
        error,
      );
      return 0;
    }
  }

  async findOne(id: string) {
    const vendor = await this.vendorRepository.findOne({
      where: {
        id,
      },
      relations: {
        user: true,
        products: true,
      },
    });
    if (!vendor) {
      throw new Error('vendor not found');
    }
    return vendor;
  }

  async update(id: string, updateVendorInput: UpdateVendorInput) {
    const isExist = await this.findOne(id);
    if (!isExist) {
      throw new Error('vendor not found');
    }
    Object.assign(isExist, updateVendorInput);
    return this.vendorRepository.save(isExist);
  }

  async remove(id: number) {
    await this.vendorRepository.delete(id);
    return {
      success: true,
      message: `This action removes a #${id} vendor`,
    };
  }

  async getMostPopularVendors(paginate: PaginationInput): Promise<Vendor[]> {
    const limit = paginate.limit;
    const skip = (paginate.page - 1) * limit;

    let query = this.vendorRepository
      .createQueryBuilder('vendor')
      .leftJoinAndSelect('vendor.products', 'product')
      .leftJoinAndSelect('product.reviews', 'review')
      .where('vendor.isVerfied = :verified', { verified: true })
      .orderBy('vendor.rating', 'DESC')
      .addOrderBy('product.purchuseCount', 'DESC')
      .limit(limit)
      .skip(skip);

    return query.getMany();
  }
}
