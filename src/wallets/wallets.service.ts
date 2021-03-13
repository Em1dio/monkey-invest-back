import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { CreateWalletDTO } from './dto/create-wallet.dto';
import { UpdateWalletDTO } from './dto/update-wallet.dto';
import { Wallets, WalletsFeatureProvider } from './schemas/wallets.schema';

@Injectable()
export class WalletsService {
  constructor(
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
      throw new Error(error);
    }
  }

  public async find(username: string) {
    const owner = await this.walletsModel
      .find({ ownerUsername: username })
      .lean();
    // const shared = await this.walletsModel.find({ sharedUsers: {$in: });
    return { ...owner };
  }

  public async update(dto: UpdateWalletDTO) {
    const wallet = this.walletsModel.find({ _id: dto.id }).exec();
    return this.walletsModel.updateOne({ _id: dto.id }, dto).exec();
  }

  public async validateWallet(walletId: string, username: string) {
    const wallet = this.walletsModel.find({ _id: walletId }).exec();
    if (wallet.isPublic) {
      return true;
    }

    if (wallet.ownerUsername === username && username in wallet.sharedUsers) {
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
      this.createWallet({ name: 'wallet' }, username);
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
      throw new Error(error);
    }
  }
}
