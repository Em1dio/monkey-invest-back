import { IsString } from 'class-validator';

export class DeleteStockDto {
  @IsString()
  id: string;

  @IsString()
  walletId: string;
}
