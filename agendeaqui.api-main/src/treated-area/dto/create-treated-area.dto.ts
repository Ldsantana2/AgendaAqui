import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateTreatedAreaDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  @ApiProperty({
    description: 'Nome da área tratada',
    example: 'Tratamento para Autismo',
  })
  name: string;
}
