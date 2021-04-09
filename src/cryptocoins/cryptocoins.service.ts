import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { WalletsService } from 'src/wallets/wallets.service';
import { CreateCryptoDto } from './dto/create-crypto.dto';
import { DeleteCryptoDto } from './dto/delete-crypto.dto';
import { CryptoFeatureProvider } from './schemas/cryptocoins.schema';

@Injectable()
export class CryptocoinsService {
  constructor(
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
    return this.cryptoModel.find({ walletId }).lean();
  }

  public async consolidate(walletId: string) {
    return this.cryptoModel.find({ walletId }).lean();
  }

  public async findOne(id: string, user: string) {
    return this.cryptoModel.findOne({ _id: id, userID: user }).lean();
  }

  // DELETE
  public async delete(dto: DeleteCryptoDto) {
    const result = await this.cryptoModel.findOne({
      _id: dto.id,
      walletId: dto.walletId,
    }).lean();
    if (!result) {
      throw new Error('User doenst have this Crypto');
    }
    return this.cryptoModel.findByIdAndDelete(dto.id);
  }
}
