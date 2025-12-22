import DataLoader from 'dataloader';
import { In, Repository } from 'typeorm';
import { Category } from '../entities/category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { RequestScoped } from 'src/core/loader.decorator';

@RequestScoped()
export class CategoryLoader {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
  ) {}

  loader() {
    return new DataLoader<string, Category>(async (ids: string[]) => {
      const data = await this.categoryRepo.find({ where: { id: In(ids) } });

      const catrgoryMap = new Map<string, Category>();
      data.forEach((category) => {
        catrgoryMap.set(category.id, category);
      });
      return ids.map((id) => catrgoryMap.get(id)!);
    });
  }
}
