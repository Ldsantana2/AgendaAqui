import { IsNotEmpty, IsString } from "class-validator";

export class CreateSpecialtyDto {
  @IsString()
  id: string;

  @IsString()
  @IsNotEmpty()
  name: string;
}
