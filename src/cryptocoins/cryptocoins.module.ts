import { CryptocoinsService } from './cryptocoins.service';
import { CryptocoinsController } from './cryptocoins.controller';
import { forwardRef, Module } from '@nestjs/common';
import { WalletsModule } from '../wallets/wallets.module';
import { MongooseModule } from '@nestjs/mongoose';
import { CryptoFeatureProvider } from './schemas/cryptocoins.schema';

@Module({
  imports: [
    forwardRef(() => WalletsModule),
    MongooseModule.forFeature([CryptoFeatureProvider]),
  ],
  controllers: [CryptocoinsController],
  providers: [CryptocoinsService],
  exports: [CryptocoinsService],
})
export class CryptocoinsModule {}
