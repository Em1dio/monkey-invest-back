import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { WalletsService } from 'src/wallets/wallets.service';
import { CreateUserDTO, UpdateUserDTO } from './dto';
import { Users, UsersFeatureProvider } from './schemas/users.schema';

@Injectable()
export class UsersService {
  constructor(
    private walletsService: WalletsService,
    @InjectModel(UsersFeatureProvider.name)
    private readonly usersModel: ReturnModelType<typeof Users>,
  ) {}

  // READ
  public async findAll() {
    return this.usersModel.find().exec();
  }

  public async findOne(username: string) {
    return this.usersModel.findOne({ username }).exec();
  }

  // CREATE
  public async create(userDto: CreateUserDTO) {
    try {
      if (!this.isEmailValid(userDto.username)) {
        throw {};
      }
      const created = new this.usersModel(userDto);
      this.walletsService.createWallet({name: 'Wallet'}, userDto.username)
      return created.save();
    } catch (error) {}
  }

  private isEmailValid(username: string) {
    return this.usersModel.findOne({ username });
  }

  // DELETE
  public async delete(id: string) {
    return this.usersModel.findByIdAndDelete(id);
  }

  // UPDATE
  public async update(userUserDto: UpdateUserDTO) {
    return this.usersModel
      .updateOne({ _id: userUserDto.id }, userUserDto)
      .exec();
  }
}
