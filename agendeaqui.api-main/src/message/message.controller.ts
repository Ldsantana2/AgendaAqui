import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
  ForbiddenException,
} from '@nestjs/common';
import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { MessageResponseDto } from './dto/response-message.dto';

@Controller('messages')
@UseGuards(JwtAuthGuard)
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post()
  create(@Request() req, @Body() createMessageDto: CreateMessageDto): Promise<MessageResponseDto> {
    return this.messageService.create(req.user.id, createMessageDto);
  }

  @Get()
  findAll(@Request() req): Promise<MessageResponseDto[]> {
    return this.messageService.findAll(req.user.id);
  }

  @Get('conversation')
  findConversation(
    @Request() req,
    @Query('userId') otherUserId: string,
  ): Promise<MessageResponseDto[]> {
    if (!otherUserId) {
      throw new ForbiddenException('User ID is required');
    }
    return this.messageService.findConversation(req.user.id, otherUserId);
  }

  @Get('unread-count')
  getUnreadCount(@Request() req): Promise<{ count: number }> {
    return this.messageService.getUnreadCount(req.user.id).then(count => ({ count }));
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req): Promise<MessageResponseDto> {
    return this.messageService.findOne(id, req.user.id);
  }

  @Get(':id/expanded')
  getExpandedMessage(@Param('id') id: string, @Request() req): Promise<MessageResponseDto> {
    return this.messageService.getExpandedMessage(id, req.user.id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateMessageDto: UpdateMessageDto,
    @Request() req,
  ): Promise<MessageResponseDto> {
    return this.messageService.update(id, req.user.id, updateMessageDto);
  }

  @Patch(':id/read')
  markAsRead(@Param('id') id: string, @Request() req): Promise<MessageResponseDto> {
    return this.messageService.markAsRead(id, req.user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req): Promise<void> {
    return this.messageService.remove(id, req.user.id);
  }
}