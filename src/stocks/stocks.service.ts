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
import { CreateStockDto, DeleteStockDto, UpdateStockUserDto } from './dto';
import { Stocks, StocksFeatureProvider } from './schemas/stocks.schema';
import { WalletsService } from './../wallets/wallets.service';
@Injectable()
export class StocksService {
  constructor(
    private httpService: HttpService,
    @Inject(forwardRef(() => WalletsService))
    private walletsService: WalletsService,
    @InjectModel(StocksFeatureProvider.name)
    private readonly stocksModel: ReturnModelType<typeof Stocks>,
  ) {}

  // READ
  public async findAll(username: string, walletId: string) {
    const result = [];

    const isValid = await this.walletsService.validateWallet(
      walletId,
      username,
    );
    if (!isValid) {
      return result;
    }

    const stocks = await this.stocksModel.find({ walletId }).lean();
    const symbols = stocks.map(x => x.symbol).join(',');

    if (symbols === '') {
      return result;
    }
    const apiStock = await this.apiCheck(symbols);

    for (const el of stocks) {
      const stock = apiStock.find(x => x.symbol === el.symbol);
      const data = {
        actualValue: stock?.regularMarketPrice || 0,
        actualTotal: stock?.regularMarketPrice * el?.quantity || 0,
        total: el.value * el.quantity,
      };
      result.push({ ...el, ...data });
    }

    return result;
  }

  public async findOne(id: string, user: string) {
    return this.stocksModel.findOne({ _id: id, userID: user }).lean();
  }

  // CONSOLIDATED - #TASK-001
  public async consolidated(walletId: string) {
    const stocks = await this.stocksModel
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

    const symbols = stocks.map(x => x._id).join(',');
    const result = { totalBefore: 0, totalActual: 0 };
    if (symbols === '') {
      return result;
    }

    const apiStock = await this.apiCheck(symbols);

    for (const stock of stocks) {
      const actualValue = apiStock.find(x => x.symbol === stock._id)
        ?.regularMarketPrice;
      result.totalBefore += stock.total;
      result.totalActual += actualValue * stock.quantity;
    }

    return result;
  }

  // CREATE
  public async create(stockUserDto: CreateStockDto, username: string) {
    const isValidStock = await this.apiValidateStock(stockUserDto.symbol);
    if (!isValidStock) {
      throw new HttpException(
        'Stock is invalid',
        HttpStatus.EXPECTATION_FAILED,
      );
    }
    stockUserDto.symbol = stockUserDto.symbol.toUpperCase();
    stockUserDto.userId = username;
    const created = new this.stocksModel(stockUserDto);
    return created.save();
  }

  // DELETE
  public async delete(dto: DeleteStockDto, username: string) {
    const isValid = await this.walletsService.validateWallet(
      dto.walletId,
      username,
    );
    if (!isValid) {
      throw new HttpException(
        'This user doenst have access to this Wallet',
        HttpStatus.BAD_REQUEST,
      );
    }

    const result = await this.stocksModel.findOne({
      _id: dto.id,
      walletId: dto.walletId,
    });
    if (!result) {
      throw new HttpException(
        'User doenst have this Stock',
        HttpStatus.BAD_REQUEST,
      );
    }
    return this.stocksModel.findByIdAndDelete(dto.id);
  }

  public async deleteWallet(dto: DeleteStockDto) {
    return this.stocksModel.deleteMany({ walletId: dto.walletId });
  }

  // UPDATE
  public async update(stockUserDto: UpdateStockUserDto) {
    return this.stocksModel
      .updateOne({ _id: stockUserDto.id }, stockUserDto)
      .exec();
  }

  private async apiCheck(stock: string) {
    const url = `https://brapi.ga/api/quote/${stock}`;
    try {
      const response = await this.httpService.get(url).toPromise();
      return response.data.results;
    } catch (error) {
      throw new HttpException(
        'brapi doenst recognize this stock',
        HttpStatus.EXPECTATION_FAILED,
      );
    }
  }

  private async apiValidateStock(stock: string) {
    const url = `https://brapi.ga/api/available?search=${stock}`;
    const response = await this.httpService.get(url).toPromise();
    return response.data.stocks.length === 1;
  }
}
