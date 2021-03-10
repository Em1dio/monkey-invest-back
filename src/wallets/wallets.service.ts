import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { CreateWalletDTO } from './dto/create-wallet.dto';
import { Wallets, WalletsFeatureProvider } from './schemas/wallets.schema';

@Injectable()
export class WalletsService {
  constructor(
    @InjectModel(WalletsFeatureProvider.name)
    private readonly walletsModel: ReturnModelType<typeof Wallets>,
  ) {}

  public async create(walletDto: CreateWalletDTO, username?: string) {
    try {
        if(!walletDto.ownerUsername && username) {
            walletDto.ownerUsername = username;
        }
      const created = new this.walletsModel(walletDto);
      return created.save();
    } catch (error) {
        throw new Error(error);
    }
  }
  
  public async find(username: string) {
    const owner = await this.walletsModel.find({ ownerUsername: username });
    // const shared = await this.walletsModel.find({ sharedUsers: {$in: });
    return { ...owner };
  }

}
