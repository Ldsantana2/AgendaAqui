import { IsString, IsOptional } from 'class-validator';

export class CreateExamTypeDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;
}