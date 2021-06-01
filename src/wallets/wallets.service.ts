import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ReturnModelType } from '@typegoose/typegoose';
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
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
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
    return result;
  }

  public async update(id: string, dto: UpdateWalletDTO, username: string) {
    const isValid = await this.validateWallet(
      id,
      username,
    );
    if (!isValid) {
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    }
    await this.walletsModel.updateOne({ _id: id }, dto).exec();
    return this.walletsModel.find({ _id: dto.id }).exec();
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
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  private async calculateTotals(walletId: string) {
    // Solucao @MeChamoGeo

    // Caio vai nesse site (https://lodash.com/) e abre o inspect e cola no terminal kkkk

    // var items = [
    //   { 'lightBlue': 4, 'darkBlue': 2, 'red': 4, 'orange': 6, 'purple': 7 },
    //   { 'lightBlue': 6, 'darkBlue': 5, 'red': 1, 'orange': 2, 'purple': 3 },
    //   { 'lightBlue': 2, 'darkBlue': 4, 'red': 3, 'orange': 4, 'purple': 9 }
    // ],

    // userSelectedColors = ['lightBlue', 'darkBlue'];

    // var totalCount = _.sumBy(userSelectedColors, _.partial(_.sumBy, items));

    // console.log(totalCount);

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
