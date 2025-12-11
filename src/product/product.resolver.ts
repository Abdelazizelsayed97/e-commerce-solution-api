import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ProductService } from './product.service';
import { Product } from './entities/product.entity';
import { CreateProductInput } from './dto/create-product.input';
import { UpdateProductInput } from './dto/update-product.input';
import { PaginationInput } from 'src/core/helper/pagination/paginatoin-input';
import { Roles } from 'src/core/helper/decorators/role.mata.decorator';
import { RoleEnum } from 'src/core/enums/role.enum';
import { UseGuards } from '@nestjs/common';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { AuthGuard } from 'src/user/guard/auth.guard';
import { PaginatedResponse } from 'src/core/helper/pagination/pagination.output';
import { PaginatedProduct } from './entities/paginated.product';

@Resolver(() => Product)
export class ProductResolver {
  constructor(private readonly productService: ProductService) {}

  @Roles(RoleEnum.vendor, RoleEnum.superAdmin)
  @UseGuards(AuthGuard, RolesGuard)
  @Mutation(() => Product, { name: 'addProduct' })
  async addProduct(
    @Args('createProductInput') createProductInput: CreateProductInput,
  ) {
    return await this.productService.AddProduct(createProductInput);
  }
  y;
  @Query(() => PaginatedProduct, { name: 'products' })
  findAll(
    @Args('paginate', { type: () => PaginationInput, nullable: true })
    paginate: PaginationInput,
    @Args('filter', { type: () => Boolean, nullable: true })
    SortByPurchuse?: boolean,
  ): Promise<PaginatedProduct> {
    console.log('paginate ', paginate);
    return this.productService.findAll(paginate, SortByPurchuse);
  }

  @Query(() => Product, { name: 'product' })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.productService.findOne(id);
  }

  @Roles(RoleEnum.vendor, RoleEnum.superAdmin)
  @UseGuards(AuthGuard, RolesGuard)
  @Mutation(() => Product)
  updateProduct(
    @Args('updateProductInput') updateProductInput: UpdateProductInput,
  ) {
    return this.productService.update(
      updateProductInput.id,
      updateProductInput,
    );
  }

  @Roles(RoleEnum.vendor, RoleEnum.superAdmin)
  @UseGuards(AuthGuard, RolesGuard)
  @Mutation(() => Product)
  removeProduct(@Args('id', { type: () => String }) id: string) {
    return this.productService.remove(id);
  }
}
