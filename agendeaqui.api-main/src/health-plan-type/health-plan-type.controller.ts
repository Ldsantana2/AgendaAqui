import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { HealthPlanTypeService } from './health-plan-type.service';
import { CreateHealthPlanTypeDto } from './dto/create-health-plan-type.dto';
import { UpdateHealthPlanTypeDto } from './dto/update-health-plan-type.dto';

@Controller('health-plan-type')
export class HealthPlanTypeController {
  constructor(private readonly service: HealthPlanTypeService) {}

  @Post()
  create(@Body() dto: CreateHealthPlanTypeDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Get('id-by-name/:name')
  getIdByPlanName(@Param('name') name: string) {
    return this.service.findIdByPlanName(name);
  }

  @Get('by-operator/:operatorId')
  getByOperator(@Param('operatorId') operatorId: string) {
    return this.service.findByHealthOperatorId(operatorId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateHealthPlanTypeDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
