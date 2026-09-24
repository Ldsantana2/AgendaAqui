import { IsString, Length } from 'class-validator';

export class ValidateTokenDto {
  @IsString()
  @Length(6, 6, { message: 'O código deve ter exatamente 6 dígitos.' })
  code: string;
}