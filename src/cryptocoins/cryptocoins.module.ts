import { CryptocoinsService } from './cryptocoins.service';
import { CryptocoinsController } from './cryptocoins.controller';
import { forwardRef, HttpModule, Module } from '@nestjs/common';
import { WalletsModule } from '../wallets/wallets.module';
import { MongooseModule } from '@nestjs/mongoose';
import { CryptoFeatureProvider } from './schemas/cryptocoins.schema';

@Module({
  imports: [
    HttpModule,
    forwardRef(() => WalletsModule),
    MongooseModule.forFeature([CryptoFeatureProvider]),
  ],
  controllers: [CryptocoinsController],
  providers: [CryptocoinsService],
  exports: [CryptocoinsService],
})
export class CryptocoinsModule {}
