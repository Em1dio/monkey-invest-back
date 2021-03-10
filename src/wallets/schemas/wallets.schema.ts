import { buildSchema, getModelForClass, prop } from '@typegoose/typegoose';

enum typeTransaction {
  ADD = 'add',
  SUB = 'sub',
  CANCELLED = "canceled",
  CUSTOM = 'custom',
}
enum statusTransaction {
  ACTIVE = 'active',
  CANCELLED = "canceled",
  DONE = 'done',
}

class Transaction {
  public subject: string;
  public value: number;
  public type: typeTransaction;
  public status: statusTransaction;
}

export class Wallets {
  @prop({ required: true })
  public name: string;

  @prop({ required: true })
  public ownerUsername: string;

  @prop({ required: false, default: () => [] })
  public sharedUsers: string[];

  @prop({ required: false, default: () => [] })
  public transactions: Transaction[];

  @prop({ required: false, default: () => false })
  public isPublic: boolean;

  @prop({ required: false, default: () => false })
  public isSimulation: boolean;
}

const WalletModel = getModelForClass(Wallets);

const WalletSchema = buildSchema(Wallets, { versionKey: false });

export const WalletsFeatureProvider = {
  name: 'Wallet',
  collection: 'Wallets',
  model: WalletModel,
  schema: WalletSchema,
};
