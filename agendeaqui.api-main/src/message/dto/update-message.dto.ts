import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateMessageDto {
  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsBoolean()
  isRead?: boolean;
}