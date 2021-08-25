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
import { JwtAuthGuard } from './../auth/jwt-auth.guard';
import { User } from './../users/decorators/Index.decorator';
import { CreateStockDto, UpdateStockUserDto, DeleteStockDto, TransferStockDto } from './dto';
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
  public findAll(@User('username') username, @Param('walletId') walletId: string) {
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

  @Post()
  async create(
    @Request() req,
    @Body() stockDto: CreateStockDto
  ) {
    return this.stocksService.create(stockDto, req.user.username);
  }

  @Delete(':walletId/:id')
  public async delete(@User('username') username, @Param() deleteDto: DeleteStockDto) {
    return this.stocksService.delete(deleteDto, username);
  }

  @Put()
  public async update(@Body() stockDto: UpdateStockUserDto) {
    return this.stocksService.update(stockDto);
  }
}
