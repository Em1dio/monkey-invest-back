import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateWalletDTO } from './dto/create-wallet.dto';
import { UpdateWalletDTO } from './dto/update-wallet.dto';
import { WalletsService } from './wallets.service';

@UseGuards(JwtAuthGuard)
@Controller('wallets')
export class WalletsController {
  constructor(private readonly walletsService: WalletsService) {}

  // CREATE - POST
  @Post()
  async create(@Body() walletDto: CreateWalletDTO, @Request() req) {
    return this.walletsService.createWallet(walletDto, req.user.username);
  }

  // READ - GET
  @Get()
  public find(@Request() req) {
    return this.walletsService.find(req.user.username);
  }

  // UPDATE - PUT
  @Put()
  public updateWallet(@Body() walletDto: UpdateWalletDTO, @Request() req) {
    return this.walletsService.update(walletDto);
  }

  // DELETE - DELETE - caso o numero seja igual a 0. Criar uma nova carteira vazia.
  @Delete()
  public remove(@Body('id') id: string, @Request() req) {
    return this.walletsService.remove(id, req.user.username);
  }
}
