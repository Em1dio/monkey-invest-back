import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { CryptocoinsService } from './../cryptocoins/cryptocoins.service';
import { StocksService } from './../stocks/stocks.service';
import { CreateWalletDTO } from './dto/create-wallet.dto';
import { UpdateWalletDTO } from './dto/update-wallet.dto';
import { Wallets, WalletsFeatureProvider } from './schemas/wallets.schema';

enum Action {
  Add = 'add',
  Remove = 'remove',
}

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
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  public async shareWallet(walletId: string, username: string, owner: string) {
    const wallet = await this.walletsModel.findOne({ _id: walletId }).exec();

    this.validateSharedWalletActions(wallet, owner, username, Action.Add);

    wallet.sharedUsers.push(username);
    await this.walletsModel.updateOne({ _id: walletId }, wallet).exec();
  }

  public async unshareWallet(
    walletId: string,
    username: string,
    owner: string,
  ) {
    const wallet = await this.walletsModel.findOne({ _id: walletId }).exec();
    this.validateSharedWalletActions(wallet, owner, username, Action.Remove);

    wallet.sharedUsers.splice(wallet.sharedUsers.indexOf(username), 1);
    await this.walletsModel.updateOne({ _id: walletId }, wallet).exec();
  }

  public async find(username: string) {
    const owner = await this.walletsModel
      .find({ ownerUsername: username })
      .exec();
    const shared = await this.walletsModel
      .find({ sharedUsers: { $in: [username] } })
      .exec();
    const result = [];
    const wallets = [...owner, ...shared];
    for (const wallet of wallets) {
      const totals = await this.calculateTotals(wallet._id.toString());

      result.push({ ...wallet._doc, ...totals });
    }
    return result;
  }

  public async update(id: string, dto: UpdateWalletDTO, username: string) {
    const isValid = await this.validateWallet(id, username);
    if (!isValid) {
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    }
    await this.walletsModel.updateOne({ _id: id }, dto).exec();
    return this.walletsModel.find({ _id: dto.id }).exec();
  }

  public async validateWallet(walletId: string, username: string) {
    const wallet = await this.walletsModel.findOne({ _id: walletId }).exec();
    if (!wallet) {
      return false;
    }

    if (wallet.isPublic) {
      return true;
    }

    if (
      wallet.ownerUsername === username ||
      wallet.sharedUsers.includes(username)
    ) {
      return true;
    }

    return false;
  }

  public async remove(id: string, username: string) {
    // Deletar o q foi pedido
    await this.walletsModel.findByIdAndDelete(id);

    // Count das atuais contas
    const existingWallets = await this.walletsModel.count({
      ownerUsername: username,
    });

    // caso nao exista, crie uma.
    if (existingWallets === 0) {
      this.createWallet({ name: 'Carteira' }, username);
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

  private validateSharedWalletActions(
    wallet: any,
    owner: string,
    username: string,
    action: Action,
  ) {
    if (wallet.ownerUsername !== owner) {
      throw new HttpException(
        'You need to be the owner to do this action.',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (!wallet) {
      throw new HttpException('Wallet not exist', HttpStatus.BAD_REQUEST);
    }

    if (action === Action.Add) {
      if (wallet.sharedUsers.includes(username)) {
        throw new HttpException('User exist in Shared Users', HttpStatus.BAD_REQUEST);
      }
    } else {
      if (!wallet.sharedUsers.includes(username)) {
        throw new HttpException('User not exist in Shared Users', HttpStatus.BAD_REQUEST);
      }
    }
  }
}
