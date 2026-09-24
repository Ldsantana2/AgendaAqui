import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export enum BlogPostStatus {
  SKETCH = 'SKETCH',
  PUBLISHED = 'PUBLISHED',
  INACTIVE = 'INACTIVE',
}

export class CreateBlogPostDto {
  @ApiProperty({
    description: 'The title of the blog post',
    example: 'How to maintain a healthy lifestyle',
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    description: 'The content of the blog post',
    example:
      'Regular exercise and a balanced diet are key to maintaining good health...',
  })
  @IsNotEmpty()
  @IsString()
  content: string;

  @ApiProperty({
    description: 'A brief summary or excerpt of the blog post content',
    example:
      'This post provides essential tips for a healthy lifestyle, focusing on diet and regular exercise.',
  })
  @IsNotEmpty() // Como 'summary' é obrigatório no seu schema.prisma, deve ser @IsNotEmpty() aqui também.
  @IsString()
  summary: string;

  @ApiProperty({
    description: 'Tags associated with the blog post',
    example: ['health', 'lifestyle', 'wellness'],
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @ApiProperty({
    description: 'The status of the blog post',
    example: 'PUBLISHED',
    enum: BlogPostStatus,
    default: BlogPostStatus.SKETCH,
  })
  @IsOptional()
  @IsEnum(BlogPostStatus)
  status?: BlogPostStatus;
}
