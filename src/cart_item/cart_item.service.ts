import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { CreateCartItemInput } from './dto/create-cart_item.input';
import { UpdateCartItemInput } from './dto/update-cart_item.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CartItem } from './entities/cart_item.entity';
import { Cart } from 'src/cart/entities/cart.entity';
import { Product } from 'src/product/entities/product.entity';
import { Vendor } from 'src/vendor/entities/vendor.entity';

@Injectable()
export class CartItemService {
  constructor(
    @InjectRepository(CartItem)
    private readonly cartItemRepository: Repository<CartItem>,
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Vendor)
    private readonly vendorRepository: Repository<Vendor>,
  ) {}

  async addItemToCart(createCartItemInput: CreateCartItemInput) {
    const cart = await this.cartRepository.findOne({
      where: { id: createCartItemInput.cartId },
    });
    if (!cart) {
      this.cartRepository.create({
        user: { id: createCartItemInput.cartId },
      });
    }

    const product = await this.productRepository.findOne({
      where: { id: createCartItemInput.productId },
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    console.log('product stock', [
      product.inStock,
      createCartItemInput.quantity,
    ]);
    if (product.inStock < createCartItemInput.quantity) {
      throw new BadRequestException(`Insufficient .`);
    }

    const vendor = await this.vendorRepository.findOne({
      where: {
        user: {
          id: createCartItemInput.userId,
        },
      },
    });
    if (!vendor) {
      throw new NotFoundException('Vendor not found');
    }

    const existingItem = await this.cartItemRepository.findOne({
      where: {
        cart: { id: createCartItemInput.cartId },
        product: { id: createCartItemInput.productId },
        vendor: {
          user: {
            id: createCartItemInput.userId,
          },
        },
      },
      relations: ['product'],
    });

    if (existingItem) {
      const newQuantity = createCartItemInput.quantity;
      if (product.inStock < newQuantity) {
        console.log('insufficient stock', newQuantity);
        throw new BadRequestException(`Insufficient stock for this quantity.`);
      }

      existingItem.quantity = newQuantity;
      existingItem.totlePrice = existingItem.quantity * product.price;
      return await this.cartItemRepository.save(existingItem);
    }

    const cartItem = this.cartItemRepository.create({
      cart: { id: createCartItemInput.cartId },
      product,
      vendor,
      quantity: createCartItemInput.quantity,
      totlePrice: createCartItemInput.quantity * product.price,
    });
    return await this.cartItemRepository.save(cartItem);
  }

  async findAll(cartId: string) {
    return await this.cartItemRepository.find({
      where: { cart: { id: cartId } },
      relations: ['product', 'vendor', 'cart'],
    });
  }

  async findOne(id: string) {
    const item = await this.cartItemRepository.findOne({
      where: { id },
      relations: {
        cart: true,
        vendor: true,
        product: true,
      },
    });
    if (!item) {
      throw new NotFoundException('Cart item not found');
    }
    return item;
  }

  async update(id: string, updateCartItemInput: UpdateCartItemInput) {
    const item = await this.cartItemRepository.findOne({
      where: { id },
      relations: ['product'],
    });
    if (!item) {
      throw new NotFoundException('Cart item not found');
    }

    if (updateCartItemInput.quantity !== undefined) {
      const product = item.product;

      if (updateCartItemInput.quantity <= 0) {
        return await this.cartItemRepository.remove(item);
      }

      if (product.inStock < updateCartItemInput.quantity) {
        throw new BadRequestException(`Insufficient stock.`);
      }

      item.quantity = updateCartItemInput.quantity;
      item.totlePrice = item.quantity * product.price;
    }

    return await this.cartItemRepository.save(item);
  }

  async remove(id: string) {
    const item = await this.cartItemRepository.findOne({
      where: { id },
    });
    if (!item) {
      throw new NotFoundException('Cart item not found');
    }
    return await this.cartItemRepository.remove(item);
  }

  async removeAllFromCart(cartId: string) {
    return await this.cartItemRepository.delete({
      cart: { id: cartId },
    });
  }

  async reduceProductStock(cartItem: CartItem): Promise<void> {
    const product = await this.productRepository.findOne({
      where: { id: cartItem.product.id },
    });

    if (!product) {
      throw new NotFoundException(`Productnot found`);
    }

    if (product.inStock < cartItem.quantity) {
      throw new BadRequestException(
        `Cannot complete order: insufficient stock`,
      );
    }

    product.inStock -= cartItem.quantity;
    await this.productRepository.save(product);
  }

  async restoreProductStock(cartItem: CartItem): Promise<void> {
    const product = await this.productRepository.findOne({
      where: { id: cartItem.product.id },
    });

    if (!product) {
      throw new NotFoundException(`Product not found`);
    }

    product.inStock += cartItem.quantity;
    await this.productRepository.save(product);
  }
}
