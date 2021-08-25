import { IsBoolean, IsDate, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateCryptoDto {
  @IsString()
  _id: string;

  @IsString()
  symbol?: string;

  @IsNumber()
  value?: number;

  @IsNumber()
  @IsOptional()
  quantity?: number;

  @IsDate()
  @IsOptional()
  buyDate?: Date;

  @IsOptional()
  @IsString()
  userId?: string;

  @IsString()
  walletId?: string;

  @IsBoolean()
  @IsOptional()
  status?: boolean;
}