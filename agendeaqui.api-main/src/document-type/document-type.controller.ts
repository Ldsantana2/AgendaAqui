import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { DocumentTypeService } from './document-type.service';
import { CreateDocumentTypeDto } from './dto/create-document-type.dto';

@Controller('document-types')
export class DocumentTypeController {
  constructor(private readonly documentTypeService: DocumentTypeService) {}

  @Post()
  async create(@Body() dto: CreateDocumentTypeDto) {
    return this.documentTypeService.create(dto);
  }

  @Get()
  async findAll() {
    return this.documentTypeService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.documentTypeService.findOne(id);
  }
}
