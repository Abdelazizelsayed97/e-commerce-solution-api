import { Injectable } from '@nestjs/common';
import { CreateCategoryInput } from './dto/create-category.input';
import { UpdateCategoryInput } from './dto/update-category.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { PaginationInput } from 'src/core/helper/pagination/paginatoin-input';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}
  async create(createCategoryInput: CreateCategoryInput) {
    const isExist = await this.categoryRepository.findOne({
      where: {
        name: createCategoryInput.name,
      },
    });
    if (isExist) {
      throw new Error('This category is alreadty exist');
    }
    const category = this.categoryRepository.create({
      ...createCategoryInput,
    });
    return this.categoryRepository.save(category);
  }

  findAll(paginate: PaginationInput) {
    const skip = (paginate?.page - 1) * paginate?.limit
    return this.categoryRepository.find();
  }

  findOne(id: string) {
    return this.categoryRepository.findOne({ where: { id } });
  }

  update(id: string, updateCategoryInput: UpdateCategoryInput) {
    return this.categoryRepository.update(id, updateCategoryInput);
  }

  remove(id: string) {
    return this.categoryRepository.delete(id);
  }
}
