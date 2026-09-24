import { PartialType } from '@nestjs/mapped-types';
import { CreateHealthOperatorDto } from './create-health-operator.dto';

export class UpdateHealthOperatorDto extends PartialType(
  CreateHealthOperatorDto,
) {}
