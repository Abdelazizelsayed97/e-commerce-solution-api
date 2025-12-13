import DataLoader from 'dataloader';
import { Product } from '../entities/product.entity';
import { DataSource } from 'typeorm';

export const productLoader = (dataSource: DataSource) => {
  return new DataLoader<string, Product>(async (productIds: string[]) => {
    const products = await dataSource
      .getRepository(Product)
      .createQueryBuilder('product')
      .whereInIds(productIds).
      leftJoinAndSelect('product.vendor', 'vendor')
      .leftJoinAndSelect('vendor.user', 'user')
      .getMany();
    const productMap: { [key: string]: Product } = {};
    products.forEach((product) => {
      productMap[product.id] = product;
    });
    return productIds.map((productId) => productMap[productId]);
  });
};
