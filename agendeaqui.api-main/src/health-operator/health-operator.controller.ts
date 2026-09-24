import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { HealthOperatorService } from './health-operator.service';
import { CreateHealthOperatorDto } from './dto/create-health-operator.dto';
import { UpdateHealthOperatorDto } from './dto/update-health-operator.dto';

@Controller('health-operator')
export class HealthOperatorController {
  constructor(private readonly service: HealthOperatorService) {}

  @Post()
  create(@Body() dto: CreateHealthOperatorDto) {
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

  @Get('by-name/:name')
  getByName(@Param('name') name: string) {
    return this.service.findByName(name);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateHealthOperatorDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
