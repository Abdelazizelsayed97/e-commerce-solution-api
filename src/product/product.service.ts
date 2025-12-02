import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductInput } from './dto/create-product.input';
import { UpdateProductInput } from './dto/update-product.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { PaginatedProduct } from './entities/paginated.product';
import { PaginationInput } from 'src/core/helper/pagination/paginatoin-input';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
  ) {}
  async AddProduct(createProductInput: CreateProductInput) {
    const product = this.productsRepository.create(createProductInput);

    return await this.productsRepository.save(product);
  }

  async findAll(
    paginate: PaginationInput,
  ): Promise<PaginatedProduct> {
    const skip = (paginate.page - 1) * paginate.limit;

    const [items, totalItems] = await this.productsRepository.findAndCount({
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
