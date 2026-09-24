import { IsString, IsOptional } from 'class-validator';

export class CreateExamDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  examTypeId?: string;
}
