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
import { CreateCryptoDto } from './dto/create-crypto.dto';
import { DeleteCryptoDto } from './dto/delete-crypto.dto';
import { CryptoFeatureProvider } from './schemas/cryptocoins.schema';
export interface ICrypto {
  code: string;
  // codein: string;
  // name: string;
  // high: string;
  // low: string;
  // varBid: string;
  // pctChange: string;
  bid: string;
  // ask: string;
  // timestamp: string;
  // create_date: string;
}
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
        'User doenst have this Crypto',
        HttpStatus.BAD_REQUEST,
      );
    }
    return this.cryptoModel.findByIdAndDelete(dto.id);
  }

  private async apiCheck(): Promise<ICrypto[]> {
    const url = 'https://economia.awesomeapi.com.br/last/BTC,LTC,ETH,XRP';
    try {
      const response = await this.httpService.get(url).toPromise();
      return response.data;
    } catch (error) {
      throw new HttpException(
        'brapi doenst recognize this stock',
        HttpStatus.EXPECTATION_FAILED,
      );
    }
  }

  private async getActualValues() {
    const results = Object.values(await this.apiCheck());
    const actual = results.reduce((acc, cur) => {
      acc.push({ code: cur.code, value: +cur.bid });
      return acc;
    }, []);
    return actual;
  }
}
