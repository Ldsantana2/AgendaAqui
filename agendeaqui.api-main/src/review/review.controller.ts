import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ReviewsService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) { }

  @Post()
  async create(@Body() createReviewDto: CreateReviewDto) {
    return await this.reviewsService.create(createReviewDto);
  }

  @Get()
  async findAll() {
    return await this.reviewsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.reviewsService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateReviewDto: UpdateReviewDto,
  ) {
    return await this.reviewsService.update(id, updateReviewDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.reviewsService.remove(id);
  }

  @Get('clinic/:clinicId')
  findByClinicId(@Param('clinicId') clinicId: string) {
    return this.reviewsService.findByClinicId(clinicId);
  }

  @Get('appointment/:appointmentId')
  async getReviewsByAppointmentId(@Param('appointmentId') appointmentId: string) {
    return await this.reviewsService.getReviewsByAppointmentId(appointmentId)
  }
}
