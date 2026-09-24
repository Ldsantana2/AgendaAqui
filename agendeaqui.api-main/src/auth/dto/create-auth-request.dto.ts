import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class CreateAuthRequestDto {
  @ApiProperty({ description: 'O e-mail do usuário', example: 'user@example.com' })
  @IsEmail()
  email: string;

  @ApiPropertyOptional({ description: 'A senha do usuário ', example: 'password123' })
  @IsString()
  password: string;
}
