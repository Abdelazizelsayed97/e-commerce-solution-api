import { Injectable } from '@nestjs/common';
import { CreateWalletInput } from './dto/create-wallet.input';
import { UpdateWalletInput } from './dto/update-wallet.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wallet } from './entities/wallet.entity';
import { UserService } from 'src/user/user.service';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(Wallet)
    private walletRepository: Repository<Wallet>,

    private readonly userService: UserService,
  ) {}
  async create(createWalletInput: CreateWalletInput) {
    const wallet = this.walletRepository.create({
      ...createWalletInput,
      user: await this.userService.findOneById(createWalletInput.userId),
      balance: 0,
      pendingBalance: 0,
      currency: 'EGP',
      transactionHistory: [],
      type: 'wallet',
    });
    return await this.walletRepository.save(wallet);
  }

  async findOne(id: string) {
    const wallet = await this.walletRepository.findOne({
      where: {
        id,
      },
      relations: {
        user: true,
      },
    });
    if (!wallet) {
      throw new Error('wallet not found');
    }
    return wallet;
  }

  async update(updateWalletInput: UpdateWalletInput) {
    const wallet = await this.findOne(updateWalletInput.id);
    if (!wallet) {
      throw new Error('wallet not found');
    }
    Object.assign(wallet, updateWalletInput);
    return this.walletRepository.save(wallet);
  }
}
