import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBlogPostDto, UpdateBlogPostDto } from './dto';
import * as crypto from 'crypto';

@Injectable()
export class BlogService {
  constructor(private prisma: PrismaService) { }

  async create(createBlogPostDto: CreateBlogPostDto) {
    const { ...blogData } = createBlogPostDto;
    return this.prisma.blogPost.create({
      data: {
        id: crypto.randomUUID(),
        ...blogData,
        updatedAt: new Date(),
      },
    });
  }

  async findAll(page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [total, blogPosts] = await Promise.all([
      this.prisma.blogPost.count(),
      this.prisma.blogPost.findMany({
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
      }),
    ]);

    return {
      data: blogPosts,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const blogPost = await this.prisma.blogPost.findUnique({
      where: { id },
    });

    if (!blogPost) {
      throw new NotFoundException(`Blog post with ID ${id} not found`);
    }

    return blogPost;
  }

  async update(id: string, updateBlogPostDto: UpdateBlogPostDto) {
    // First check if the blog post exists and belongs to the user
    const blogPost = await this.prisma.blogPost.findUnique({
      where: { id },
    });

    if (!blogPost) {
      throw new NotFoundException(`Blog post with ID ${id} not found`);
    }

    return this.prisma.blogPost.update({
      where: { id },
      data: updateBlogPostDto,
    });
  }

  async remove(id: string) {
    // First check if the blog post exists and belongs to the user
    const blogPost = await this.prisma.blogPost.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!blogPost) {
      throw new NotFoundException(`Blog post with ID ${id} not found`);
    }

    await this.prisma.blogPost.delete({
      where: { id },
    });

    return { message: 'Blog post deleted successfully' };
  }

  async findAllPublished(page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [total, blogPosts] = await Promise.all([
      this.prisma.blogPost.count(),
      this.prisma.blogPost.findMany({
        where: {
          status: "PUBLISHED"
        },
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
      }),
    ]);

    return {
      data: blogPosts,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
