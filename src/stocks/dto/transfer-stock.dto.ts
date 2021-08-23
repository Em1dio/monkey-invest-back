import {
  IsString
} from 'class-validator';

export class TransferStockDto {
  @IsString()
  walletFrom: string;

  @IsString()
  walletTo: string;
}
