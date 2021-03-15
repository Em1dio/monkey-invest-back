import { WalletsController } from './wallets.controller';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WalletsFeatureProvider } from './schemas/wallets.schema';
import { WalletsService } from './wallets.service';

@Module({
  imports: [MongooseModule.forFeature([WalletsFeatureProvider])],
  controllers: [WalletsController],
  providers: [WalletsService],
  exports: [WalletsService],
})
export class WalletsModule {}
