import { Module, HttpModule } from '@nestjs/common';
import { StocksController } from './stocks.controller';
import { StocksService } from './stocks.service';
import { MongooseModule } from '@nestjs/mongoose';
import { StocksFeatureProvider } from './schemas/stocks.schema';
import { WalletsModule } from 'src/wallets/wallets.module';

@Module({
  imports: [
    HttpModule,
    WalletsModule,
    MongooseModule.forFeature([StocksFeatureProvider]),
  ],
  controllers: [StocksController],
  providers: [StocksService],
})
export class StocksModule {}
