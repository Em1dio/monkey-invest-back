import { Body, Controller, Get, Post, Request } from '@nestjs/common';
import { CreateWalletDTO } from './dto/create-wallet.dto';
import { WalletsService } from './wallets.service';

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

  // DELETE - DELETE
}
