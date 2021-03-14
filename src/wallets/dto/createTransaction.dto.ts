import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';
import { statusTransaction, typeTransaction } from '../schemas/wallets.schema';

export class CreateTransacionsDTO {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  ownerUsername?: string;

  @IsBoolean()
  @IsOptional()
  isPublic?: boolean;

  @IsBoolean()
  @IsOptional()
  isSimulation?: boolean;

  @IsString()
  subject: string;

  @IsNumber()
  value: number;

  type: typeTransaction;
  status: statusTransaction;
}
