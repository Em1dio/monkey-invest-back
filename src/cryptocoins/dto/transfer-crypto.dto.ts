import {
  IsString
} from 'class-validator';

export class TransferCryptoDto {
  @IsString()
  walletTo: string;
}
