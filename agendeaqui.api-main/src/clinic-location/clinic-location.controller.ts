import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
} from '@nestjs/common';
import { ClinicLocationService } from './clinic-location.service';
import { CreateClinicLocationDto } from './dto/create-clinic-location.dto';
import { UpdateClinicLocationDto } from './dto/update-clinic-location.dto';

@Controller('clinic-location')
export class ClinicLocationController {
  constructor(private readonly service: ClinicLocationService) { }

  @Post()
  create(@Body() dto: CreateClinicLocationDto) {
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
  update(@Param('id') id: string, @Body() dto: UpdateClinicLocationDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
