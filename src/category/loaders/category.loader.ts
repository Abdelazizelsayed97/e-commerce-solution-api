import DataLoader from 'dataloader';
import { DataSource, In } from 'typeorm';
import { Category } from '../entities/category.entity';

export const categoryLoader = (dataSource: DataSource) => {
  return new DataLoader<string, Category>(async (ids: string[]) => {
    const data = await dataSource
      .getRepository(Category)
      .find({ where: { id: In(ids) } });

    const catrgoryMap = new Map<string, Category>();
    data.forEach((category) => {
      catrgoryMap.set(category.id, category);
    });
    return ids.map((id) => catrgoryMap.get(id)!);
  });
};
