import { Module, HttpModule, forwardRef } from '@nestjs/common';
import { StocksController } from './stocks.controller';
import { StocksService } from './stocks.service';
import { MongooseModule } from '@nestjs/mongoose';
import { StocksFeatureProvider } from './schemas/stocks.schema';
import { WalletsModule } from 'src/wallets/wallets.module';

@Module({
  imports: [
    HttpModule,
    forwardRef(() => WalletsModule),
    MongooseModule.forFeature([StocksFeatureProvider]),
  ],
  controllers: [StocksController],
  providers: [StocksService],
  exports: [StocksService],
})
export class StocksModule {}
