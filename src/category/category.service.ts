import { Injectable } from '@nestjs/common';
import { CreateCategoryInput } from './dto/create-category.input';
import { UpdateCategoryInput } from './dto/update-category.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}
  create(createCategoryInput: CreateCategoryInput) {
    const category = this.categoryRepository.create({
      ...createCategoryInput,
    });
    return this.categoryRepository.save(category);
  }

  findAll() {
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
