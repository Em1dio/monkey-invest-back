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
import { DeleteCryptoDto } from './dto/delete-crypto.dto';

@UseGuards(JwtAuthGuard)
@Controller('cryptocoins')
export class CryptocoinsController {
  constructor(private readonly cryptocoinsService: CryptocoinsService) {}
  @Get(':walletId')
  public findAll(@Param('walletId') walletId: string) {
    return this.cryptocoinsService.findAll(walletId);
  }

  //   @Post('')
  //   Public create() {
  //       return this.cryptocoinsService.create();
  //   }

  @Delete(':walletId/:id')
  public async delete(@Param() deleteDto: DeleteCryptoDto) {
    return this.cryptocoinsService.delete(deleteDto);
  }
}
