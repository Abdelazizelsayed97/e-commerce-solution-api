import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { WishList } from "./entities/wish.list.entity";
import { User } from "src/user/entities/user.entity";
import { Product } from "./entities/product.entity";

@Injectable()
export class WishListService {
  constructor(
    @InjectRepository(WishList)
    private repo: Repository<WishList>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
    @InjectRepository(Product)
    private productRepo: Repository<Product>
  ) {}

  async addAndRemoveToWishList(userId: string, productId: string): Promise<WishList | null> {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    const product = await this.productRepo.findOne({ where: { id: productId } });
    
    if (!user || !product) {
      throw new NotFoundException('User or Product not found');
    }

    const isExistInWishList = await this.repo.findOne({ where: { user: { id: userId }, productId } });
    
    if (isExistInWishList) {
      await this.repo.remove(isExistInWishList);
      return null;
    }

    const wishListItem = this.repo.create({ user, productId });
    return await this.repo.save(wishListItem);
  }

  async getWishList(userId: string): Promise<WishList[]> {
    const wishList = await this.repo.find({ where: { user: { id: userId } } });
    return wishList;
  }
}
