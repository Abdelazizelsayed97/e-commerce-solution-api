import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from './entities/user.entity';

import { PaginationInput } from 'src/core/helper/pagination/paginatoin-input';
import { UpdateUserInput } from './dto/update-user.input';
import { CurrentUser } from 'src/core/helper/decorators/current.user';
import { PaginatedResponse } from 'src/core/helper/pagination/pagination.output';
import { PaginatedUsers } from './entities/paginated.user';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) { }

  @Query(() => PaginatedUsers, { name: 'users' })
  findAll(
    @Args('paginate', { type: () => PaginationInput, nullable: true })
    paginate: PaginationInput,
  ) {
    console.log('paginate', paginate);
    return this.userService.findAll(paginate);
  }

  @Query(() => User, { name: 'user' })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.userService.findOneById(id);
  }

  @Mutation(() => User)
  updateUser(@Args('updateUserInput') updateUserInput: UpdateUserInput) {
    return this.userService.update(updateUserInput.id, updateUserInput);
  }

  @Mutation(() => User)
  removeUser(@Args('id', { type: () => String }) id: string) {
    return this.userService.remove(id);
  }
  @Query(() => User)
  async me(@CurrentUser() user: User) {
    if (user !== null || user !== undefined) {
      return user;
    }
  }
}
