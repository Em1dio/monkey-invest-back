import { IsBoolean, IsDate, IsOptional, IsString } from 'class-validator';

export class CreateWalletDTO {
  @IsString()
  name: string

  @IsOptional()
  @IsString()
  ownerUsername?: string

  @IsBoolean()
  @IsOptional()
  isPublic?: boolean

  @IsBoolean()
  @IsOptional()
  isSimulation?: boolean
}