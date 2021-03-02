import { IsBoolean, IsDate, IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';

export class CreateStockUserDto {
  value: number;
  symbol: string;
  quantity?: number;
  buyDate?: Date;
  sellDate?: Date;
  userID?: string;
  status?: boolean;
}
