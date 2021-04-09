import {
  arrayProp,
  buildSchema,
  getModelForClass,
  prop,
} from '@typegoose/typegoose';
import * as moment from 'moment';
export class Cryptos {
  @prop({ required: true })
  public symbol: string;

  @prop({ required: true })
  public value: number;

  @prop({ required: false, default: () => 0 })
  public quantity: number;

  @prop({ required: true })
  public walletId: string;

  @prop({ required: true })
  public userId: string;

  @prop({ required: false, default: () => moment.utc().toDate() })
  public buyDate: Date;

  @prop({ required: false })
  public sellDate: Date;

  @prop({ required: false, default: () => true })
  public status: boolean;

  @prop({ required: false })
  public origin: string;
}

const CryptoModel = getModelForClass(Cryptos);

const CryptoSchema = buildSchema(Cryptos, { versionKey: false });

export const CryptoFeatureProvider = {
  name: 'Crypto',
  collection: 'Cryptos',
  model: CryptoModel,
  schema: CryptoSchema,
};
