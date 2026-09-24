import { IsUUID } from 'class-validator';

export class AssignTreatedAreaDto {
  @IsUUID()
  treatedAreaId: string;
}
