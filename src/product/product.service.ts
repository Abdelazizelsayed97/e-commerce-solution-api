import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductInput } from './dto/create-product.input';
import { UpdateProductInput } from './dto/update-product.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';

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

  async findAll() {
    return await this.productsRepository.find({});
  }

  async findOne(id: string) {
const isExist = await this.productsRepository.findOne({
  where:{
    id
  }
})
 if(isExist){
  return isExist
 } else {
   throw new NotFoundException("product not found");
 }


  }

  update(id: number, updateProductInput: UpdateProductInput) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
