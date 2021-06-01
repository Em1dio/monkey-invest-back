import { IsOptional, IsString } from 'class-validator';

export class DeleteStockDto {
  @IsString()
  @IsOptional()
  id?: string;

  @IsString()
  @IsOptional()
  walletId?: string;
}
