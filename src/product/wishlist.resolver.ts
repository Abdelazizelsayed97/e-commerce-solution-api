import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { WishListService } from './wish.list.service';
import { WishList } from './entities/wish.list.entity';
import { AuthGuard } from 'src/user/guard/auth.guard';
import { CurrentUser } from 'src/core/helper/decorators/current.user';
import { User } from 'src/user/entities/user.entity';

@Resolver(() => WishList)
export class WishListResolver {
  constructor(private readonly wishListService: WishListService) {}

  @UseGuards(AuthGuard)
  @Mutation(() => WishList, { nullable: true })
  async toggleWishlist(
    @Args('productId') productId: string,
    @CurrentUser() user: User,
  ): Promise<WishList | null> {
    return await this.wishListService.addAndRemoveToWishList(
      user.id,
      productId,
    );
  }

  @UseGuards(AuthGuard)
  @Query(() => [WishList], { name: 'wishlist' })
  async getWishlist(@CurrentUser() user: User): Promise<WishList[]> {
    return await this.wishListService.getWishList(user.id);
  }
}
