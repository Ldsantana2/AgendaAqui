import { PartialType } from '@nestjs/swagger';
import { CreateSpecialtyDto } from './create-specialty.dto';
import { AssignSpecialtyDto } from './assign-specialty.dto';

export class UpdateSpecialtyDto extends PartialType(AssignSpecialtyDto) {}
