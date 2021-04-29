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
import { User } from 'src/users/decorators/Index.decorator';
import { CryptocoinsService } from './cryptocoins.service';
import { CreateCryptoDto } from './dto/create-crypto.dto';
import { DeleteCryptoDto } from './dto/delete-crypto.dto';

@UseGuards(JwtAuthGuard)
@Controller('cryptocoins')
export class CryptocoinsController {
  constructor(private readonly cryptocoinsService: CryptocoinsService) {}

  @Get('consolidated/:walletId')
  public consolidated(@Param('walletId') walletId: string) {
    return this.cryptocoinsService.consolidated(walletId);
  }

  @Get(':walletId')
  public findAll(@Param('walletId') walletId: string) {
    return this.cryptocoinsService.findAll(walletId);
  }

  @Post()
  async create(@User('username') username, @Body() dto: CreateCryptoDto) {
    return this.cryptocoinsService.create(dto, username);
  }

  @Delete(':walletId/:id')
  public async delete(@Request() req, @Param() deleteDto: DeleteCryptoDto) {
    return this.cryptocoinsService.delete(deleteDto);
  }

  // @Delete()
  // public async delete(@Body() deleteDto: DeleteCryptoDto) {
  //   return this.cryptocoinsService.delete(deleteDto);
  // }
}
