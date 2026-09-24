import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { HealthPlanService } from './health-plan.service';
import { CreateHealthPlanDto } from './dto/create-health-plan.dto';
import { UpdateHealthPlanDto } from './dto/update-health-plan.dto';

@Controller('health-plan')
export class HealthPlanController {
  constructor(private readonly healthPlanService: HealthPlanService) {}

  @Post()
  create(@Body() createHealthPlanDto: CreateHealthPlanDto) {
    return this.healthPlanService.create(createHealthPlanDto);
  }

  @Get()
  findAll() {
    return this.healthPlanService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.healthPlanService.findOne(id);
  }

  @Get('/patient/:patientId')
  findByPatient(@Param('patientId') patientId: string) {
    return this.healthPlanService.findByPatient(patientId);
  }

  @Get('/patient/:patientId/primary')
  findPrimaryByPatient(@Param('patientId') patientId: string) {
    return this.healthPlanService.findPrimaryByPatient(patientId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateHealthPlanDto: UpdateHealthPlanDto,
  ) {
    return this.healthPlanService.update(id, updateHealthPlanDto);
  }

  @Patch('set-primary/:id')
  setPrimary(@Param('id') id: string) {
    return this.healthPlanService.setPrimaryHealthPlan(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.healthPlanService.remove(id);
  }
}
