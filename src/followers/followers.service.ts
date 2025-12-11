import { Injectable } from '@nestjs/common';
import { CreateFollowerInput } from './dto/create-follower.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Follower } from './entities/follower.entity';
import { UserService } from 'src/user/user.service';
import { VendorService } from 'src/vendor/vendor.service';
import { PaginationInput } from 'src/core/helper/pagination/paginatoin-input';

@Injectable()
export class FollowersService {
  constructor(
    @InjectRepository(Follower)
    private followersRepository: Repository<Follower>,
    private readonly vendorService: VendorService,
    private readonly userService: UserService,
  ) {}
  async followVendor(createFollowerInput: CreateFollowerInput) {
    const isFollowed = await this.followersRepository
      .createQueryBuilder('follower')
      .where('follower.followerId = :followerId', {
        followerId: createFollowerInput.followerId,
      })
      .andWhere('follower.vendorId = :vendorId', {
        vendorId: createFollowerInput.vendorId,
      })
      .getOne();
    if (isFollowed) {
      return isFollowed;
    }

    const followerUser = await this.userService.findOneById(
      createFollowerInput.followerId,
    );
    const followedVendor = await this.vendorService.findOne(
      createFollowerInput.vendorId,
    );

    const follow = Object.create(createFollowerInput);
    follow.follower = followerUser;
    follow.vendor = followedVendor;

    return await this.followersRepository.save(follow);
  }

  async getFollowersList(vendorId: string, PaginationInput: PaginationInput) {
    const skip = (PaginationInput.page - 1) * PaginationInput.limit;
    const followers = await this.followersRepository.find({
      where: {
        vendor: {
          id: vendorId,
        },
      },
      relations: {
        follower: true,
      },
      skip: skip,
      take: PaginationInput.limit,
    });
    return {
      items: {
        followers: followers.map((follower) => follower.follower),
        id: followers.map((follower) => follower.id),
      },
      // pagination: {
      //   totalItems: followers.length,
      //   itemCount: followers.length,
      //   itemsPerPage: PaginationInput.limit,
      //   totalPages: Math.ceil(followers.length / PaginationInput.limit),
      //   currentPage: PaginationInput.page,
      // },
    };
  }

  getFollowingList(id: string, PaginationInput: PaginationInput) {
    const skip = (PaginationInput.page - 1) * PaginationInput.limit;

    return this.followersRepository.find({
      where: {
        follower: {
          id: id,
        },
      },
      relations: {
        vendor: true,
      },
      skip: skip,
      take: PaginationInput.limit,
    });
  }

  async unfollowVendor(vendorId: string, followerId: string) {
    const follow = await this.followersRepository
      .createQueryBuilder('follower')
      .where('follower.followerId = :followerId', { followerId })
      .andWhere('follower.vendorId = :vendorId', { vendorId })
      .getOne();

    if (!follow) {
      throw new Error('Not following this vendor');
    }

    await this.followersRepository.remove(follow);
    return { message: 'Successfully unfollowed vendor' };
  }
}
