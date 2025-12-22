import DataLoader from 'dataloader';
import { In, Repository } from 'typeorm';
import { Wallet } from '../entities/wallet.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { RequestScoped } from 'src/core/loader.decorator';


@RequestScoped()
export class WalletLoader {
  constructor(
    @InjectRepository(Wallet)
    private readonly walletRepo: Repository<Wallet>,
  ) {}

  loader() {
    return new DataLoader<string, Wallet>(async (ids) => {
      const wallets = await this.walletRepo.find({
        where: { id: In(ids as string[]) },
        relations: {
          user: true,
          transactionHistory: true,
        },
      });

      const map = new Map(wallets.map((w) => [w.id, w]));

      return ids.map((id) => {
        const wallet = map.get(id);
        return wallet ?? new Error(`Wallet not found: ${id}`);
      });
    });
  }
}
