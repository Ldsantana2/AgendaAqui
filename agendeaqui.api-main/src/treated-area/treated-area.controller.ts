import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { TreatedAreaService } from './treated-area.service';
import { CreateTreatedAreaDto } from './dto/create-treated-area.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('treated-areas')
export class TreatedAreaController {
  constructor(private readonly treatedAreaService: TreatedAreaService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post()
  async create(@Body() dto: CreateTreatedAreaDto) {
    return this.treatedAreaService.create(dto);
  }

  @Get()
  async findAll() {
    return this.treatedAreaService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.treatedAreaService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.treatedAreaService.remove(id);
  }
}
