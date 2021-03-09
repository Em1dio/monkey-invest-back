import {
  HttpException,
  HttpService,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { CreateStockUserDto, UpdateStockUserDto } from './dto';
import { Stocks, StocksFeatureProvider } from './schemas/stocks.schema';

@Injectable()
export class StocksService {
  constructor(
    private httpService: HttpService,
    @InjectModel(StocksFeatureProvider.name)
    private readonly stocksModel: ReturnModelType<typeof Stocks>,
  ) {}

  // READ
  public async findAll(user: string) {
    const stocks = await this.stocksModel.find({ userID: user }).lean();

    const result = [];
    for (const el of stocks) {
      const stock = await this.apiCheck(el.symbol);
      const data = {
        actualValue: stock.regularMarketPrice,
        actualTotal: stock.regularMarketPrice * el.quantity,
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
  public async consolidated(user: string) {
    const stocks = await this.stocksModel
      .find({ userID: user }, { _id: 0, symbol: 1, quantity: 1, value: 1 })
      .lean();

    const result = { totalBefore: 0, totalActual: 0 };
    for (const stock of stocks) {
      const apiStock = await this.apiCheck(stock.symbol);
      const actualValue = apiStock.regularMarketPrice;
      result.totalBefore += stock.value * stock.quantity;
      result.totalActual += actualValue * stock.quantity;
    }

    return result;
  }

  // CREATE
  public async create(stockUserDto: CreateStockUserDto, user: string) {
    stockUserDto.userID = user;
    const created = new this.stocksModel(stockUserDto);
    return created.save();
  }

  // DELETE
  public async delete(id: string, user: string) {
    const result = await this.stocksModel.findOne({ _id: id, userID: user });
    if (!result) {
      throw new Error('User doenst have this Stock');
    }
    return this.stocksModel.findByIdAndDelete(id);
  }

  // UPDATE
  public async update(stockUserDto: UpdateStockUserDto) {
    return this.stocksModel
      .updateOne({ _id: stockUserDto.id }, stockUserDto)
      .exec();
  }

  public async apiCheck(stock: string) {
    const url = `https://brapi.ga/api/quote/${stock}`;
    try {
      const response = await this.httpService.get(url).toPromise();
      return response.data.results[0];
    } catch (error) {
      throw new HttpException(
        'brapi doenst recognize this stock',
        HttpStatus.EXPECTATION_FAILED,
      );
    }
  }
}
