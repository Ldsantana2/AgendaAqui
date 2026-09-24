import { ServiceCategoryService } from './service-category.service';
import { CreateServiceCategoryDto } from './dto/create-service-category.dto';
import { Body, Controller, Get, Post } from '@nestjs/common';

@Controller('service_category')
export class ServiceCategoryController {
  constructor(private readonly serviceCategoryService: ServiceCategoryService) {}

  @Post()
  async create(@Body() createServiceDto: CreateServiceCategoryDto) {
    return this.serviceCategoryService.create(createServiceDto);
  }

  @Get()
  async getAll() {
    return this.serviceCategoryService.getAllServices();
  }
}
