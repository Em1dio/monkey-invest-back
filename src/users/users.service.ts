import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ReturnModelType } from '@typegoose/typegoose';
import * as bcrypt from 'bcrypt';
import { doc } from 'prettier';
import { WalletsService } from 'src/wallets/wallets.service';
import { ChangePasswordDTO, CreateUserDTO, UpdateUserDTO } from './dto';
import { Users, UsersFeatureProvider } from './schemas/users.schema';

@Injectable()
export class UsersService {
  constructor(
    private walletsService: WalletsService,
    @InjectModel(UsersFeatureProvider.name)
    private readonly usersModel: ReturnModelType<typeof Users>,
  ) {}

  public async findAll() {
    return this.usersModel.find().exec();
  }

  public async findOne(username: string) {
    return this.usersModel.findOne({ username }).exec();
  }

  public async changePassword(dto: ChangePasswordDTO, username: string) {
    const doc = await this.usersModel.findOne({ username }).lean();
    const comparePassword = await bcrypt.compare(dto.oldPassword, doc.password);
    if (comparePassword) {
      doc.password = await bcrypt.hash(dto.password, 10);
      await this.usersModel.updateOne({ _id: doc._id }, doc).exec();
      delete doc.password;
      return doc;
    }
    throw new BadRequestException('Incorrect Password');
  }

  public async create(userDto: CreateUserDTO) {
    try {
      if (!this.isEmailValid(userDto.username)) {
        throw {};
      }
      userDto.password = await bcrypt.hash(userDto.password, 10);
      const created = new this.usersModel(userDto);
      this.walletsService.createWallet({ name: 'Wallet' }, userDto.username);
      await created.save();
      delete userDto.password;
      return userDto;
    } catch (error) {}
  }

  private isEmailValid(username: string) {
    return this.usersModel.findOne({ username });
  }

  public async delete(id: string) {
    return this.usersModel.findByIdAndDelete(id);
  }

  public async update(userUserDto: UpdateUserDTO) {
    return this.usersModel
      .updateOne({ _id: userUserDto.id }, userUserDto)
      .exec();
  }
}
