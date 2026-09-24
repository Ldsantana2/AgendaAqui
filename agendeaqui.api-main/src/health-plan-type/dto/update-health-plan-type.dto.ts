import { PartialType } from '@nestjs/mapped-types';
import { CreateHealthPlanTypeDto } from './create-health-plan-type.dto';

export class UpdateHealthPlanTypeDto extends PartialType(
  CreateHealthPlanTypeDto,
) {}
