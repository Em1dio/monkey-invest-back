import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { User } from 'src/users/decorators/Index.decorator';
import { CreateWalletDTO } from './dto/create-wallet.dto';
import { UpdateWalletDTO } from './dto/update-wallet.dto';
import { WalletsService } from './wallets.service';

@UseGuards(JwtAuthGuard)
@Controller('wallets')
export class WalletsController {
  constructor(private readonly walletsService: WalletsService) {}

  // CREATE - POST
  @Post()
  async create(@Body() walletDto: CreateWalletDTO, @User('username') username) {
    return this.walletsService.createWallet(walletDto, username);
  }

  // READ - GET
  @Get()
  public find( @User('username') username) {
    return this.walletsService.find(username);
  }

  // UPDATE - PUT
  @Put(':id')
  public updateWallet(
    @Param('id') id: string,
    @Body() walletDto: UpdateWalletDTO,
    @User('username') username
  ) {
    return this.walletsService.update(id, walletDto, username);
  }

  // DELETE - DELETE - caso o numero seja igual a 0. Criar uma nova carteira vazia.
  @Delete(':id')
  public remove(@Param('id') id: string,  @User('username') username) {
    return this.walletsService.remove(id, username);
  }
}
