import { IsString, IsOptional } from 'class-validator';

export class UpdateExamTypeDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;
}