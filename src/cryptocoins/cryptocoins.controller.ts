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
import { CryptocoinsService } from './cryptocoins.service';
import { CreateCryptoDto } from './dto/create-crypto.dto';
import { DeleteCryptoDto } from './dto/delete-crypto.dto';

// @UseGuards(JwtAuthGuard)
@Controller('cryptocoins')
export class CryptocoinsController {
  constructor(private readonly cryptocoinsService: CryptocoinsService) {}
  @Get(':walletId')
  public findAll(@Param('walletId') walletId: string) {
    return this.cryptocoinsService.findAll(walletId);
  }

  @Post()
  async create(@Body() dto: CreateCryptoDto, @Request() req) {
    return this.cryptocoinsService.create(dto, req.user.username);
  }

  @Delete()
  public async delete(@Body() deleteDto: DeleteCryptoDto) {
    return this.cryptocoinsService.delete(deleteDto);
  }
}
