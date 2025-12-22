import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { FollowersService } from './followers.service';
import { Follower } from './entities/follower.entity';
import { CreateFollowerInput } from './dto/create-follower.input';
import { UpdateFollowerInput } from './dto/update-follower.input';
import { PaginationInput } from 'src/core/helper/pagination/paginatoin-input';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/user/guard/auth.guard';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { Roles } from 'src/core/helper/decorators/role.mata.decorator';
import { RoleEnum } from 'src/core/enums/role.enum';
import { PaginatedFollowers } from './entities/paginated.followers';

@Resolver(() => Follower)
export class FollowersResolver {
  constructor(private readonly followersService: FollowersService) {}

  @Mutation(() => Follower, { name: 'followVendor' })
  @UseGuards(AuthGuard)
  createFollower(
    @Args('followVendor') createFollowerInput: CreateFollowerInput,
  ) {
    return this.followersService.followVendor(createFollowerInput);
  }
  @Query(() => [Follower], { name: 'userFollowing' })
  getFollowingList(
    @Args('userId', { type: () => String }) userId: string,
    @Args('paginate', { type: () => PaginationInput, nullable: true })
    paginate: PaginationInput,
  ) {
    return this.followersService.getFollowingList(userId, paginate);
  }

  @Query(() => PaginatedFollowers, { name: 'vendorFollowers' })
  findAllFollowers(
    @Args('vendorId', { type: () => String }) vendorId: string,
    @Args('paginate', { type: () => PaginationInput, nullable: true })
    paginate: PaginationInput,
  ) {
    return this.followersService.getFollowersList(vendorId, paginate);
  }
}
