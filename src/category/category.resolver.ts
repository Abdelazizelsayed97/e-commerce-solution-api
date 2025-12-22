import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { CategoryService } from './category.service';
import { Category } from './entities/category.entity';
import { CreateCategoryInput } from './dto/create-category.input';
import { UpdateCategoryInput } from './dto/update-category.input';
import { Roles } from 'src/core/helper/decorators/role.mata.decorator';
import { RoleEnum } from 'src/core/enums/role.enum';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/user/guard/auth.guard';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { PaginationInput } from 'src/core/helper/pagination/paginatoin-input';
import { PaginatedCategory } from './entities/paginated.category';

@Resolver(() => Category)
export class CategoryResolver {
  constructor(private readonly categoryService: CategoryService) {}

  @Roles(RoleEnum.superAdmin)
  @UseGuards(AuthGuard, RolesGuard)
  @Mutation(() => Category)
  createCategory(
    @Args('createCategoryInput') createCategoryInput: CreateCategoryInput,
  ) {
    return this.categoryService.create(createCategoryInput);
  }

  @Query(() => PaginatedCategory, { name: 'category' })
  findAllCategory(
    @Args('paginationsInput', { nullable: true })
    paginationInput: PaginationInput,
  ) {
    return this.categoryService.findAllCategories(paginationInput);
  }

  @Query(() => Category, { name: 'category' })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.categoryService.findOne(id);
  }

  @Roles(RoleEnum.superAdmin)
  @UseGuards(AuthGuard, RolesGuard)
  @Mutation(() => Category)
  updateCategory(
    @Args('updateCategoryInput') updateCategoryInput: UpdateCategoryInput,
  ) {
    return this.categoryService.update(
      updateCategoryInput.id,
      updateCategoryInput,
    );
  }

  @Roles(RoleEnum.superAdmin)
  @UseGuards(AuthGuard, RolesGuard)
  @Mutation(() => Category)
  removeCategory(@Args('id', { type: () => String }) id: string) {
    return this.categoryService.remove(id);
  }
}
