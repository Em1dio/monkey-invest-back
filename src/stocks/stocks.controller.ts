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
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateStockDto, UpdateStockUserDto } from './dto';
import { StocksService } from './stocks.service';

@UseGuards(JwtAuthGuard)
@Controller('stocks')
export class StocksController {
  constructor(private readonly stocksService: StocksService) {}

  @Get('consolidated/:walletId')
  public consolidated(@Param('walletId') walletId: string) {
    return this.stocksService.consolidated(walletId);
  }

  @Get(':walletId')
  public findAll(@Request() req, @Param('walletId') walletId: string) {
    return this.stocksService.findAll(req.user.username, walletId);
  }

  @Post()
  async create(@Body() stockDto: CreateStockDto) {
    return this.stocksService.create(stockDto);
  }

  @Delete(':id')
  public async delete(@Request() req, @Param('id') id: string) {
    return this.stocksService.delete(id, req.user.username);
  }

  @Put()
  public async update(@Body() stockDto: UpdateStockUserDto) {
    return this.stocksService.update(stockDto);
  }
}
