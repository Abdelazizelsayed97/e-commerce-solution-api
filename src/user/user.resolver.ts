import {
  Resolver,
  Query,
  Mutation,
  Args,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { PaginationInput } from 'src/core/helper/pagination/paginatoin-input';
import { UpdateUserInput } from './dto/update-user.input';
import { CurrentUser } from 'src/core/helper/decorators/current.user';
import { PaginatedUser } from './entities/paginated.user';
import { UseGuards } from '@nestjs/common';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { RoleEnum } from 'src/core/enums/role.enum';
import { Roles } from 'src/core/helper/decorators/role.mata.decorator';
import { AuthGuard } from './guard/auth.guard';
import { Vendor } from 'src/vendor/entities/vendor.entity';

import { VendorLoader } from 'src/vendor/loaders/vendor.loader';

@Resolver(() => User)
export class UserResolver {
  constructor(
    private readonly userService: UserService,
    private readonly vendorLoader: VendorLoader,
  ) {}

  @Query(() => PaginatedUser, { name: 'users' })
  findAllUsers(
    @Args('paginate', { type: () => PaginationInput, nullable: true })
    paginate: PaginationInput,
  ) {
    console.log('paginate', paginate);
    return this.userService.findAllUsers(paginate);
  }

  @Query(() => User, { name: 'user' })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.userService.findOneById(id);
  }

  @Mutation(() => User)
  @UseGuards(AuthGuard)
  updateUser(@Args('updateUserInput') updateUserInput: UpdateUserInput) {
    return this.userService.update(updateUserInput.id, updateUserInput);
  }

  @Mutation(() => User)
  @Roles(RoleEnum.superAdmin)
  @UseGuards(AuthGuard, RolesGuard)
  removeUser(@Args('id', { type: () => String }) id: string) {
    return this.userService.remove(id);
  }
  @Query(() => User)
  async me(@CurrentUser() user: User) {
    if (user !== null || user !== undefined) {
      return user;
    }
  }

  @ResolveField(() => Vendor)
  async vendor(@Parent() user: User) {
    console.log('useruseruseruser', user);
    if (!user.vendor) return null;
    const vendor = await this.vendorLoader.loader().load(user.vendor?.id ?? '');
    return vendor;
  }
}
