import { CryptocoinsService } from './cryptocoins.service';
import { CryptocoinsController } from './cryptocoins.controller';
import { Module } from '@nestjs/common';

@Module({
  imports: [],
  controllers: [CryptocoinsController],
  providers: [CryptocoinsService],
})
export class CryptocoinsModule {}
