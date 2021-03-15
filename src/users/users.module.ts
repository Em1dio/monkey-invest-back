import { UsersService } from './users.service';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersController } from './users.controller';
import { UsersFeatureProvider } from './schemas/users.schema';
import { WalletsModule } from 'src/wallets/wallets.module';

@Module({
  imports: [WalletsModule, MongooseModule.forFeature([UsersFeatureProvider])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
