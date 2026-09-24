import { IsString } from 'class-validator';

export class CreateServiceCategoryDto {
  @IsString()
  name: string;
}
