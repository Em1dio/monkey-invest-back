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
import { CryptocoinsService } from './cryptocoins.service';
import {
  CreateCryptoDto,
  DeleteCryptoDto,
  TransferCryptoDto,
  UpdateCryptoDto,
} from './dto';

@UseGuards(JwtAuthGuard)
@Controller('cryptocoins')
export class CryptocoinsController {
  constructor(private readonly cryptocoinsService: CryptocoinsService) {}

  @Get('get-crypto')
  public getCryptos() {
    return this.cryptocoinsService.getCryptos();
  }

  @Get('consolidated/:walletId')
  public consolidated(@Param('walletId') walletId: string) {
    return this.cryptocoinsService.consolidated(walletId);
  }

  @Get(':walletId')
  public findAll(@Param('walletId') walletId: string) {
    return this.cryptocoinsService.findAll(walletId);
  }

  @Post('transfer/:walletId/:id')
  async transfer(
    @User('username') username,
    @Param('walletId') walletId: string,
    @Param('id') id: string,
    @Body() dto: TransferCryptoDto,
  ) {
    const data = {
      ...dto,
      id,
      walletId,
    };
    return this.cryptocoinsService.transfer(username, data);
  }

  @Post()
  async create(@User('username') username, @Body() dto: CreateCryptoDto) {
    return this.cryptocoinsService.create(dto, username);
  }

  @Put(':walletId/:id')
  async update(
    @User('username') username,
    @Param('walletId') walletId: string,
    @Body() dto: UpdateCryptoDto,
  ) {
    return this.cryptocoinsService.update(walletId, username, dto);
  }

  @Delete(':walletId/:id')
  public async delete(
    @User('username') username,
    @Param() deleteDto: DeleteCryptoDto,
  ) {
    return this.cryptocoinsService.delete(deleteDto);
  }
}
