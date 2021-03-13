import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateWalletDTO {
  @IsString()
  id?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  ownerUsername?: string;

  @IsBoolean()
  @IsOptional()
  isPublic?: boolean;

  @IsBoolean()
  @IsOptional()
  isSimulation?: boolean;
}
