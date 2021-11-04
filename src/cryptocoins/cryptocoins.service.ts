import {
  forwardRef,
  HttpException,
  HttpService,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { WalletsService } from './../wallets/wallets.service';
import { ICrypto, ITransferCrypto } from './interfaces/cryptocoins.interface';
import { CreateCryptoDto } from './dto/create-crypto.dto';
import { DeleteCryptoDto } from './dto/delete-crypto.dto';
import { UpdateCryptoDto } from './dto/update-crypto.dto';
import { CryptoFeatureProvider } from './schemas/cryptocoins.schema';

@Injectable()
export class CryptocoinsService {
  constructor(
    private httpService: HttpService,
    @Inject(forwardRef(() => WalletsService))
    private walletsService: WalletsService,
    @InjectModel(CryptoFeatureProvider.name)
    private readonly cryptoModel: ReturnModelType<typeof Crypto>,
  ) {}

  // CREATE
  public async create(dto: CreateCryptoDto, username: string) {
    dto.userId = username;
    const created = new this.cryptoModel(dto);
    return created.save();
  }

  // READ
  public async findAll(walletId: string) {
    const actual = await this.getActualValues();

    const cryptos = await this.cryptoModel.find({ walletId }).lean();
    const result = [];
    for (const crypto of cryptos) {
      const actualValue = actual.find(x => x.code === crypto.symbol).value;
      result.push({ ...crypto, actualValue });
    }

    return { actual, cryptos: result };
  }

  public async consolidated(walletId: string) {
    const cryptos = await this.cryptoModel
      .aggregate([
        { $match: { walletId } },
        {
          $project: {
            _id: 0,
            symbol: 1,
            quantity: 1,
            total: { $multiply: ['$value', '$quantity'] },
          },
        },
        {
          $group: {
            _id: '$symbol',
            quantity: { $sum: '$quantity' },
            total: { $sum: '$total' },
          },
        },
      ])
      .exec();

    const result = { totalBefore: 0, totalActual: 0 };
    const actualValues = await this.getActualValues();

    for (const crypto of cryptos) {
      const actualValue = actualValues.find(x => x.code === crypto._id).value;
      result.totalBefore += crypto.total;
      result.totalActual += actualValue * crypto.quantity;
    }

    return result;
  }

  public async findOne(id: string, user: string) {
    return this.cryptoModel.findOne({ _id: id, userID: user }).lean();
  }

  // DELETE
  public async delete(dto: DeleteCryptoDto) {
    const result = await this.cryptoModel
      .findOne({
        _id: dto.id,
        walletId: dto.walletId,
      })
      .lean();
    if (!result) {
      throw new HttpException(
        'User doesnt have this Crypto',
        HttpStatus.BAD_REQUEST,
      );
    }
    return this.cryptoModel.findByIdAndDelete(dto.id);
  }

  public async update(
    walletId: string,
    username: string,
    dto: UpdateCryptoDto,
  ) {
    // wallet is valid
    const wallet = await this.walletsService.validateWallet(walletId, username);
    if (!wallet) {
      throw new HttpException(
        'User doesnt have access to this wallet',
        HttpStatus.BAD_REQUEST,
      );
    }

    return this.cryptoModel.updateOne({ _id: dto._id }, dto).exec();
  }

  public async getCryptos() {
    const crypto = [
      'BTC',
      'ETH',
      'BNB',
      'ADA',
      'USDT',
      'XRP',
      'DOGE',
      'HEX',
      'USDC',
      'DOT1',
      'SOL1',
      'UNI3',
      'BCH',
      'LINK',
      'LTC',
      'MATIC',
      'LUNA1',
      'ETC',
      'XLM',
      'ICP1',
      'VET',
      'THETA',
      'FIL',
      'TRX',
      'AAVE',
    ];
    return crypto;
  }

  private async apiCheck(): Promise<ICrypto[]> {
    const crypto = await this.getCryptos();
    try {
      const response = await this.httpService
        .get(
          `https://brapi.ga/api/v2/crypto?coin=${crypto.join(
            ',',
          )}&currency=BRL`,
        )
        .toPromise();
      return response.data.coins;
    } catch (error) {
      throw new HttpException(
        'brapi doesnt recognize this crypto',
        HttpStatus.EXPECTATION_FAILED,
      );
    }
  }

  private async getActualValues() {
    const results = await this.apiCheck();
    const actual = results.reduce((acc, cur) => {
      acc.push({ code: cur.coin, value: +cur.regularMarketPrice });
      return acc;
    }, []);
    return actual;
  }

  public async transfer(username: string, data: ITransferCrypto) {
    const wallet = await this.walletsService.validateWallet(data.walletFrom, username);
    const walletTo = await this.walletsService.validateWallet(data.walletTo, username);
    if (!wallet || !walletTo) {
      throw new HttpException(
        'User doesnt have access to these wallets',
        HttpStatus.BAD_REQUEST,
      );
    }

    const crypto = await this.cryptoModel.findOne({ _id: data.id, walletId: data.walletFrom });
    if (!crypto) {
      throw new HttpException(
        'User doesnt have this Crypto',
        HttpStatus.BAD_REQUEST,
      );
    }
    crypto.walletId = data.walletTo;
    await crypto.save();

    return crypto;
  }
}
