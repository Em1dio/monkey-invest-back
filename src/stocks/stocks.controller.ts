import {
  Body,
  Controller,
  Delete,
  Get, Headers, Param,
  Post,
  Put,
  UseGuards
} from '@nestjs/common';
import { JwtAuthGuard } from './../auth/jwt-auth.guard';
import { ValidWalletGuard } from './../auth/validWallet.guard';
import { User } from './../users/decorators/Index.decorator';
import {
  CreateStockDto, TransferStockDto,
  UpdateStockUserDto
} from './dto';
import { StocksService } from './stocks.service';

@UseGuards(JwtAuthGuard)
@Controller('stocks')
export class StocksController {
  constructor(private readonly stocksService: StocksService) {}

  @UseGuards(ValidWalletGuard)
  @Get('consolidated')
  public consolidated(@Headers('walletid') walletId) {
    return this.stocksService.consolidated(walletId);
  }

  @UseGuards(ValidWalletGuard)
  @Get()
  public findAll(@User('username') username, @Headers('walletid') walletId) {
    return this.stocksService.findAll(username, walletId);
  }

  @Post('transfer/:id')
  async transfer(
    @User('username') username,
    @Param('id') id: string,
    @Body() dto: TransferStockDto,
  ) {
    const data = {
      ...dto,
      id,
    };
    return this.stocksService.transfer(username, data);
  }

  @UseGuards(ValidWalletGuard)
  @Post()
  async create(
    @Headers('walletid') walletId,
    @User('username') username,
    @Body() stockDto: CreateStockDto,
  ) {
    const data = { walletId, ...stockDto };
    return this.stocksService.create(data, username);
  }

  @UseGuards(ValidWalletGuard)
  @Delete(':id')
  public async delete(
    @Headers('walletid') walletId,
    @User('username') username,
    @Param('id') id: string,
  ) {
    const data = { id, walletId };
    return this.stocksService.delete(data, username);
  }

  @Put()
  public async update(@Body() stockDto: UpdateStockUserDto) {
    return this.stocksService.update(stockDto);
  }
}
