import { Body, Controller, Delete, Get, Post, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateWalletDTO } from './dto/create-wallet.dto';
import { WalletsService } from './wallets.service';

@UseGuards(JwtAuthGuard)
@Controller()
export class WalletsController {
  constructor(private readonly walletsService: WalletsService) {}

  // CREATE - POST
  @Post()
  async create(@Body() walletDto: CreateWalletDTO, @Request() req) {
    return this.walletsService.create(walletDto, req.user.username);
  }

  // READ - GET localhost:3000/wallets
  @Get()
  public find(@Request() req) {
    return this.walletsService.find(req.user.username);
  }

  // UPDATE - PUT

  // DELETE - DELETE - caso o numero seja igual a 0. Criar uma nova carteira vazia.
  @Delete()
  public remove(@Body('id') id: string, @Request() req) {
    return this.walletsService.remove(id, req.user.username);
  }
}
