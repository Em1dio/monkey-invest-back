import { IsBoolean, IsDate, IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';

export class CreateStockDto {
  value: number;
  symbol: string;
  walletId: string;
  quantity?: number;
  buyDate?: Date;
  sellDate?: Date;
  userID?: string;
  status?: boolean;
}
