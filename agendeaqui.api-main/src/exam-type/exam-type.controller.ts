import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ExamTypeService } from './exam-type.service';
import { CreateExamTypeDto } from './dto/create-exam-type.dto';
import { UpdateExamTypeDto } from './dto/update-exam-type.dto';

@Controller('exam-type')
export class ExamTypeController {
  constructor(private readonly examTypeService: ExamTypeService) {}

  @Post()
  create(@Body() createExamTypeDto: CreateExamTypeDto) {
    return this.examTypeService.create(createExamTypeDto);
  }

  @Get()
  findAll() {
    return this.examTypeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.examTypeService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateExamTypeDto: UpdateExamTypeDto) {
    return this.examTypeService.update(id, updateExamTypeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.examTypeService.remove(id);
  }
}