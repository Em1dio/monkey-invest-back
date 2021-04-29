import {
  arrayProp,
  buildSchema,
  getModelForClass,
  prop,
} from '@typegoose/typegoose';
import * as moment from 'moment';
export class Stocks {
  @prop({ required: true })
  public symbol: string;

  @prop({ required: true })
  public value: number;

  @prop({ required: false, default: () => 1 })
  public quantity: number;

  @prop({ required: true })
  public walletId: string;

  @prop({ required: false, default: () => moment.utc().toDate() })
  public buyDate: Date;

  @prop({ required: false })
  public sellDate: Date;

  @prop({ required: false, default: () => true })
  public status: boolean;

  @prop({ required: true })
  public userId: string;
}

const StockModel = getModelForClass(Stocks);

const StockSchema = buildSchema(Stocks, { versionKey: false });

export const StocksFeatureProvider = {
  name: 'Stock',
  collection: 'Stocks',
  model: StockModel,
  schema: StockSchema,
};
