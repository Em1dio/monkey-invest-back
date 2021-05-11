import { IsBoolean, IsDate, IsOptional, IsString } from 'class-validator';

export class ChangePasswordDTO {
  @IsString()
  password: string
  @IsString()
  oldPassword: string
}