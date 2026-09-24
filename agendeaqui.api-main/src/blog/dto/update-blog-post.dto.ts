import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { BlogPostStatus } from './create-blog-post.dto';

export class UpdateBlogPostDto {
  @ApiProperty({
    description: 'The title of the blog post',
    example: 'Updated: How to maintain a healthy lifestyle',
    required: false,
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({
    description: 'The content of the blog post',
    example: 'Updated content: Regular exercise and a balanced diet are key to maintaining good health...',
    required: false,
  })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiProperty({
    description: 'Tags associated with the blog post',
    example: ['health', 'lifestyle', 'wellness', 'nutrition'],
    type: [String],
    required: false,
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @ApiProperty({
    description: 'The status of the blog post',
    example: 'PUBLISHED',
    enum: BlogPostStatus,
    required: false,
  })
  @IsOptional()
  @IsEnum(BlogPostStatus)
  status?: BlogPostStatus;

  @ApiProperty({
    description: "The summary of the blog post",
    example: "A article basead in importance of water and...",
  })
  @IsNotEmpty()
  @IsString()
  summary: string
}
