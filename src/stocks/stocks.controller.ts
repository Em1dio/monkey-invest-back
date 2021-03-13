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
  Headers
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateStockUserDto, UpdateStockUserDto } from './dto';
import { StocksService } from './stocks.service';

@UseGuards(JwtAuthGuard)
@Controller('stocks')
export class StocksController {
  constructor(private readonly stocksService: StocksService) {}
  @Get(':walletId')
  public findAll(@Request() req, @Param('id') walletId: string) {
    return this.stocksService.findAll(req.user.username, walletId);
  }

  @Get('consolidated')
  public consolidated(@Request() req) {
    return this.stocksService.consolidated(req.user.username);
  }

  @Post()
  async create(@Request() req, @Body() stockDto: CreateStockUserDto) {
    return this.stocksService.create(stockDto, req.user.username);
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
