import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
} from '@nestjs/common';
import { ClinicServiceService } from './clinic-service.service';
import { CreateClinicServiceDto } from './dto/create-clinic-service.dto';
import { UpdateClinicServiceDto } from './dto/update-clinic-service.dto';

@Controller('clinic-service')
export class ClinicServiceController {
  constructor(private readonly service: ClinicServiceService) {}

  @Post()
  create(@Body() dto: CreateClinicServiceDto) {
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

  @Get('by-clinic/:clinicId')
  findByClinicId(@Param('clinicId') clinicId: string) {
    return this.service.findByClinicId(clinicId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateClinicServiceDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
