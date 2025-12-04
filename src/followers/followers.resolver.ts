import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { FollowersService } from './followers.service';
import { Follower } from './entities/follower.entity';
import { CreateFollowerInput } from './dto/create-follower.input';
import { UpdateFollowerInput } from './dto/update-follower.input';
import { PaginationInput } from 'src/core/helper/pagination/paginatoin-input';

@Resolver(() => Follower)
export class FollowersResolver {
  constructor(private readonly followersService: FollowersService) {}

  @Mutation(() => Follower, { name: 'followVendor' })
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

  @Query(() => [Follower], { name: 'vendorFollowers' })
  findAll(
    @Args('vendorId', { type: () => String }) vendorId: string,
    @Args('paginate', { type: () => PaginationInput, nullable: true })
    paginate: PaginationInput,
  ) {
    return this.followersService.getFollowersList(vendorId, paginate);
  }

  @Query(() => Follower, { name: 'follower' })
  findOne(@Args('id', { type: () => Int }) id: string) {
    return this.followersService.findOne(id);
  }

  @Mutation(() => Follower)
  updateFollower(
    @Args('updateFollowerInput') updateFollowerInput: UpdateFollowerInput,
  ) {
    return this.followersService.update(
      updateFollowerInput.id,
      updateFollowerInput,
    );
  }

  @Mutation(() => Follower)
  removeFollower(@Args('id', { type: () => String }) id: string) {
    return this.followersService.remove(id);
  }
}
