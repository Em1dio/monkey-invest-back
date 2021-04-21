import { IsString } from 'class-validator';

export class DeleteCryptoDto {
  @IsString()
  id: string;

  @IsString()
  walletId: string;
}
