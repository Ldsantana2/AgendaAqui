import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { BlogService } from './blog.service';
import { CreateBlogPostDto, UpdateBlogPostDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { IsPublic } from '../auth/decorators/is-public.decorator';

@ApiTags('blog')
@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) { }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new blog post' })
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createBlogPostDto: CreateBlogPostDto) {
    return this.blogService.create(createBlogPostDto);
  }

  @Get()
  @IsPublic()
  @ApiOperation({ summary: 'Get all blog posts with pagination' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @HttpCode(HttpStatus.OK)
  findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.blogService.findAll(page, limit);
  }

  @Get('/published')
  @IsPublic()
  @ApiOperation({ summary: 'Get all blog posts with pagination' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @HttpCode(HttpStatus.OK)
  findAllPublished(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.blogService.findAllPublished(page, limit);
  }

  @Get(':id')
  @IsPublic()
  @ApiOperation({ summary: 'Get a blog post by ID' })
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: string) {
    return this.blogService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a blog post' })
  @HttpCode(HttpStatus.OK)
  update(
    @Param('id') id: string,
    @Body() updateBlogPostDto: UpdateBlogPostDto,
    @Req() req,
  ) {
    return this.blogService.update(id, updateBlogPostDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a blog post' })
  @HttpCode(HttpStatus.OK)
  remove(@Param('id') id: string, @Req() req) {
    return this.blogService.remove(id);
  }
}
