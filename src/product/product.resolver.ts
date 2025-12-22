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
import { UseGuards } from '@nestjs/common';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { AuthGuard } from 'src/user/guard/auth.guard';
import { PaginatedProduct } from './entities/paginated.product';
import { User } from 'src/user/entities/user.entity';
import { CurrentUser } from 'src/core/helper/decorators/current.user';
import { Vendor } from 'src/vendor/entities/vendor.entity';
import { VendorLoader } from 'src/vendor/loaders/vendor.loader';
import { UserLoader } from 'src/user/loader/users.loader';
import { RatingAndReviewLoader } from 'src/rating-and-review/loaders/rating-and-review.loader';
import { RatingAndReview } from 'src/rating-and-review/entities/rating-and-review.entity';
import { Category } from 'src/category/entities/category.entity';
import { CategoryLoader } from 'src/category/loaders/category.loader';

@Resolver(() => Product)
export class ProductResolver {
  constructor(
    private readonly productService: ProductService,
    private readonly vendorLoader: VendorLoader,
    private readonly userLoader: UserLoader,
    private readonly reviewLoader: RatingAndReviewLoader,
    private readonly categoryLoader: CategoryLoader,
  ) {}

  @Roles(RoleEnum.vendor, RoleEnum.superAdmin)
  @UseGuards(AuthGuard, RolesGuard)
  @Mutation(() => Product, { name: 'addProduct' })
  async addProduct(
    @Args('createProductInput') createProductInput: CreateProductInput,
  ) {
    return await this.productService.AddProduct(createProductInput);
  }

  @Query(() => PaginatedProduct, { name: 'products' })
  findAllProducts(
    @Args('paginate', { type: () => PaginationInput, nullable: true })
    paginate: PaginationInput,
    @Args('filter', { type: () => Boolean, nullable: true })
    SortByPurchuse?: boolean,
  ) {
    return this.productService.findAllProducts(paginate, SortByPurchuse);
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

  @Roles(RoleEnum.vendor)
  @UseGuards(AuthGuard, RolesGuard)
  @Mutation(() => Product)
  async updateProduct(
    @Args('updateProductInput') updateProductInput: UpdateProductInput,
    @CurrentUser() user: User,
  ) {
    return await this.productService.update(
      updateProductInput.productId,
      updateProductInput,
      user,
    );
  }

  @Roles(RoleEnum.vendor, RoleEnum.superAdmin)
  @UseGuards(AuthGuard, RolesGuard)
  @Mutation(() => Product)
  removeProduct(
    @Args('id', { type: () => String }) id: string,
    @CurrentUser() user: User,
  ) {
    return this.productService.remove(id, user);
  }

  @ResolveField(() => Vendor, { nullable: true })
  async vendor(@Parent() product: Product) {
    if (!product.vendor) return null;

    console.log('productproductproduct', product);
    return this.vendorLoader.loader().load(product.vendor.id);
  }
  @ResolveField(() => User, { nullable: true })
  async user(@Parent() product: Product) {
    if (!product.vendor) return null;

    return this.userLoader.loader().load(product.vendor.user.id);
  }
  @ResolveField(() => RatingAndReview, { nullable: true })
  async reviews(@Parent() product: Product) {
    return this.reviewLoader.loader().load(product.id);
  }
  @ResolveField(() => Category, { nullable: true })
  async category(@Parent() product: Product) {
    return this.categoryLoader.loader().load(product.categoryId);
  }
}
