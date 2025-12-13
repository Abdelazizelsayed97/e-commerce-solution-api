import {
  Resolver,
  Query,
  Mutation,
  Args,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { ProductService } from './product.service';
import { Product } from './entities/product.entity';
import { CreateProductInput } from './dto/create-product.input';
import { UpdateProductInput } from './dto/update-product.input';
import { PaginationInput } from 'src/core/helper/pagination/paginatoin-input';
import { Roles } from 'src/core/helper/decorators/role.mata.decorator';
import { RoleEnum } from 'src/core/enums/role.enum';
import { NotFoundException, UseGuards } from '@nestjs/common';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { AuthGuard } from 'src/user/guard/auth.guard';

import { PaginatedProduct } from './entities/paginated.product';
import { User } from 'src/user/entities/user.entity';

import { CurrentUser } from 'src/core/helper/decorators/current.user';
import { Vendor } from 'src/vendor/entities/vendor.entity';
import { VendorLoader } from 'src/vendor/loaders/vendor.loader';
import DataLoader from 'dataloader';
import { DataSource } from 'typeorm';
import { UserLoader } from 'src/user/loader/users.loader';
import { productLoader } from './loader/product.loader';
import { RatingAndReviewLoader } from 'src/rating-and-review/loaders/rating-and-review.loader';
import { RatingAndReview } from 'src/rating-and-review/entities/rating-and-review.entity';

@Resolver(() => Product)
export class ProductResolver {
  vendorLoader: DataLoader<string, Vendor | null>;
  productLoader: DataLoader<string, Product>;
  userLoader: DataLoader<string, User>;
  reviewLoader: DataLoader<string, RatingAndReview>;
  constructor(
    private readonly productService: ProductService,

    dataSource: DataSource,
  ) {
    this.vendorLoader = VendorLoader(dataSource.getRepository(Vendor));
    this.userLoader = UserLoader(dataSource.getRepository(User));
    this.productLoader = productLoader(dataSource);
    this.reviewLoader = RatingAndReviewLoader(
      dataSource.getRepository(RatingAndReview),
    );
  }

  @Roles(RoleEnum.vendor, RoleEnum.superAdmin)
  @UseGuards(AuthGuard, RolesGuard)
  @Mutation(() => Product, { name: 'addProduct' })
  async addProduct(
    @Args('createProductInput') createProductInput: CreateProductInput,
  ) {
    return await this.productService.AddProduct(createProductInput);
  }

  @Query(() => PaginatedProduct, { name: 'products' })
  findAll(
    @Args('paginate', { type: () => PaginationInput, nullable: true })
    paginate: PaginationInput,
    @Args('filter', { type: () => Boolean, nullable: true })
    SortByPurchuse?: boolean,
  ): Promise<PaginatedProduct> {
    return this.productService.findAll(paginate, SortByPurchuse);
  }

  @UseGuards(AuthGuard)
  @Query(() => PaginatedProduct, { name: 'followedVendorProducts' })
  async getFollowedVendorProducts(
    @CurrentUser() user: User,
    @Args('paginate', { type: () => PaginationInput, nullable: true })
    paginate: PaginationInput,
  ): Promise<PaginatedProduct> {
    return this.productService.getFollowedVendorProducts(user.id, paginate);
  }

  @Query(() => PaginatedProduct, { name: 'vendorProducts' })
  async getVendorProducts(
    @Args('vendorId', { type: () => String }) vendorId: string,
    @Args('paginate', { type: () => PaginationInput, nullable: true })
    paginate: PaginationInput,
  ): Promise<PaginatedProduct> {
    return this.productService.getVendorProducts(vendorId, paginate);
  }

  @Query(() => Product, { name: 'product' })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.productService.findOne(id);
  }

  @Roles(RoleEnum.vendor, RoleEnum.superAdmin)
  @UseGuards(AuthGuard, RolesGuard)
  @Mutation(() => Product)
  async updateProduct(
    @Args('updateProductInput') updateProductInput: UpdateProductInput,
  ) {
    const isExist = await this.findOne(updateProductInput.id);
    if (isExist) {
      throw new NotFoundException('product not found');
    }
    const updatedProduct = Object.assign(isExist, updateProductInput);
    return await this.productService.update(
      updateProductInput.id,
      updatedProduct,
    );
  }

  @Roles(RoleEnum.vendor, RoleEnum.superAdmin)
  @UseGuards(AuthGuard, RolesGuard)
  @Mutation(() => Product)
  removeProduct(@Args('id', { type: () => String }) id: string) {
    return this.productService.remove(id);
  }

  @ResolveField(() => Vendor, { nullable: true })
  async vendor(@Parent() product: Product) {
    if (!product.vendor) return null;

    console.log('productproductproduct', product);
    return this.vendorLoader.load(product.vendor.id);
  }
  @ResolveField(() => User, { nullable: true })
  async user(@Parent() product: Product) {
    if (!product.vendor) return null;

    return this.userLoader.load(product.vendor.user.id);
  }
  @ResolveField(()=>RatingAndReview,{nullable:true})
  async reviews(@Parent() product:Product){
    return this.reviewLoader.load(product.id)
  }
}
