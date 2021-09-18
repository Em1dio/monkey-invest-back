import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  Request,
  Headers,
} from '@nestjs/common';
import { ValidWalletGuard } from 'src/auth/validWallet.guard';
import { JwtAuthGuard } from './../auth/jwt-auth.guard';
import { User } from './../users/decorators/Index.decorator';
import { CryptocoinsService } from './cryptocoins.service';
import { CreateCryptoDto, TransferCryptoDto, UpdateCryptoDto } from './dto';

@UseGuards(JwtAuthGuard)
@Controller('cryptocoins')
export class CryptocoinsController {
  constructor(private readonly cryptocoinsService: CryptocoinsService) {}

  @Get('get-crypto')
  public getCryptos() {
    return this.cryptocoinsService.getCryptos();
  }

  @UseGuards(ValidWalletGuard)
  @Get('consolidated')
  public consolidated(@Headers('walletid') walletId: string) {
    return this.cryptocoinsService.consolidated(walletId);
  }

  @UseGuards(ValidWalletGuard)
  @Get()
  public findAll(@Headers('walletid') walletId: string) {
    return this.cryptocoinsService.findAll(walletId);
  }

  @Post('transfer/:id')
  async transfer(
    @User('username') username,
    @Param('id') id: string,
    @Body() dto: TransferCryptoDto,
  ) {
    const data = {
      ...dto,
      id,
    };
    return this.cryptocoinsService.transfer(username, data);
  }

  @UseGuards(ValidWalletGuard)
  @Post()
  async create(
    @User('username') username,
    @Headers('walletid') walletId: string,
    @Body() dto: CreateCryptoDto,
  ) {
    const data = { ...dto, walletId };
    return this.cryptocoinsService.create(data, username);
  }

  @UseGuards(ValidWalletGuard)
  @Put(':id')
  async update(
    @User('username') username,
    @Headers('walletid') walletId: string,
    @Body() dto: UpdateCryptoDto,
  ) {
    return this.cryptocoinsService.update(walletId, username, dto);
  }

  @UseGuards(ValidWalletGuard)
  @Delete(':id')
  public async delete(
    @User('username') username,
    @Param('id') id: string,
    @Headers('walletid') walletId: string,
  ) {
    const data = { id, walletId };
    return this.cryptocoinsService.delete(data);
  }
}
