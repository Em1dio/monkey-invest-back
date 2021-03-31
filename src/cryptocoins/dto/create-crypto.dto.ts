import { IsBoolean, IsDate, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateCryptoDto {
  @IsString()
  symbol: string;

  @IsNumber()
  value: number;

  @IsNumber()
  @IsOptional()
  quantity: number;

  @IsDate()
  @IsOptional()
  buyDate?: Date;

  @IsString()
  userId: string;

  @IsBoolean()
  @IsOptional()
  status?: boolean;
}
