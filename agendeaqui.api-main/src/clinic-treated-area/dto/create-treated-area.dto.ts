import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateTreatedAreaDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;
}
