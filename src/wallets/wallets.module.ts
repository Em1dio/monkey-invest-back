import { WalletsController } from './wallets.controller';
import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WalletsFeatureProvider } from './schemas/wallets.schema';
import { WalletsService } from './wallets.service';
import { StocksModule } from 'src/stocks/stocks.module';

@Module({
  imports: [
    forwardRef(() => StocksModule),
    MongooseModule.forFeature([WalletsFeatureProvider])
  ],
  controllers: [WalletsController],
  providers: [WalletsService],
  exports: [WalletsService],
})
export class WalletsModule {}
