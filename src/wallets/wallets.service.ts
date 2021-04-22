import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { promises } from 'dns';
import { CryptocoinsService } from 'src/cryptocoins/cryptocoins.service';
import { StocksService } from 'src/stocks/stocks.service';
import { CreateWalletDTO } from './dto/create-wallet.dto';
import { UpdateWalletDTO } from './dto/update-wallet.dto';
import { Wallets, WalletsFeatureProvider } from './schemas/wallets.schema';

@Injectable()
export class WalletsService {
  constructor(
    @Inject(forwardRef(() => StocksService))
    private stocksService: StocksService,
    private cryptocoinsService: CryptocoinsService,
    @InjectModel(WalletsFeatureProvider.name)
    private readonly walletsModel: ReturnModelType<typeof Wallets>,
  ) {}

  public async createWallet(walletDto: CreateWalletDTO, username?: string) {
    try {
      if (!walletDto.ownerUsername && username) {
        walletDto.ownerUsername = username;
      }
      const created = new this.walletsModel(walletDto);
      return created.save();
    } catch (error) {
      throw new HttpException(error, HttpStatus.FORBIDDEN);
    }
  }

  public async find(username: string) {
    const owner = await this.walletsModel
      .find({ ownerUsername: username })
      .exec();
    // const shared = await this.walletsModel.find({ sharedUsers: {$in: });
    const result = [];
    for (const wallet of owner) {
      const totals = await this.calculateTotals(wallet._id.toString());

      result.push({ ...wallet._doc, ...totals });
    }
    return { ...result };
  }

  public async update(dto: UpdateWalletDTO) {
    const wallet = this.walletsModel.find({ _id: dto.id }).exec();
    return this.walletsModel.updateOne({ _id: dto.id }, dto).exec();
  }

  public async validateWallet(walletId: string, username: string) {
    const wallet = await this.walletsModel.findOne({ _id: walletId }).exec();
    if (wallet.isPublic) {
      return true;
    }

    if (wallet.ownerUsername === username || username in wallet.sharedUsers) {
      return true;
    }

    return false;
  }

  public async remove(id: string, username: string) {
    await this.walletsModel.findByIdAndDelete(id);

    const existingWallets = await this.walletsModel.count({
      ownerUsername: username,
    });

    if (existingWallets === 0) {
      this.createWallet({ name: 'wallet' }, username);
    }
  }

  // Transactions
  public async createTransaction(
    walletDto: CreateWalletDTO,
    username?: string,
  ) {
    try {
      if (!walletDto.ownerUsername && username) {
        walletDto.ownerUsername = username;
      }
      const created = new this.walletsModel(walletDto);
      return created.save();
    } catch (error) {
      throw new HttpException(error, HttpStatus.FORBIDDEN);
    }
  }

  private async calculateTotals(walletId: string) {
    const totals = { totalBefore: 0, totalActual: 0 };

    const [stocksConsolidated, cryptoConsolidated] = await Promise.all([
      this.stocksService.consolidated(walletId),
      this.cryptocoinsService.consolidated(walletId),
    ]);

    totals.totalBefore += stocksConsolidated.totalBefore;
    totals.totalActual += stocksConsolidated.totalActual;

    totals.totalBefore += cryptoConsolidated.totalBefore;
    totals.totalActual += cryptoConsolidated.totalActual;

    return totals;
  }
}
