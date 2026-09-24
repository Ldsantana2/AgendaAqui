import { IsString, IsOptional } from 'class-validator';

export class UpdateExamDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  examTypeId?: string;
}
