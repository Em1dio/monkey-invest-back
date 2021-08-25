import {
  IsString
} from 'class-validator';

export class TransferCryptoDto {
  @IsString()
  walletFrom: string;
  
  @IsString()
  walletTo: string;
}