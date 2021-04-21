import { WalletsController } from './wallets.controller';
import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WalletsFeatureProvider } from './schemas/wallets.schema';
import { WalletsService } from './wallets.service';
import { StocksModule } from 'src/stocks/stocks.module';
import { CryptocoinsModule } from 'src/cryptocoins/cryptocoins.module';

@Module({
  imports: [
    forwardRef(() => StocksModule),
    forwardRef(() => CryptocoinsModule),
    MongooseModule.forFeature([WalletsFeatureProvider])
  ],
  controllers: [WalletsController],
  providers: [WalletsService],
  exports: [WalletsService],
})
export class WalletsModule {}
