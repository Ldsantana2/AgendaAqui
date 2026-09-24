import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { MessageResponseDto } from './dto/response-message.dto';

@Injectable()
export class MessageService {
  constructor(private readonly prisma: PrismaService) {}

  async create(senderId: string, createMessageDto: CreateMessageDto): Promise<MessageResponseDto> {
    const { content, receiverId } = createMessageDto;

    // Check if receiver exists
    const receiver = await this.prisma.user.findUnique({
      where: { id: receiverId },
    });

    if (!receiver) {
      throw new NotFoundException(`Receiver with ID ${receiverId} not found`);
    }

    // Create the message
    const message = await this.prisma.message.create({
      data: {
        content,
        senderId,
        receiverId,
      },
    });

    return this.formatMessageResponse(message);
  }

  async findAll(userId: string): Promise<MessageResponseDto[]> {
    const messages = await this.prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId },
          { receiverId: userId },
        ],
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return Promise.all(messages.map(message => this.formatMessageResponse(message)));
  }

  async findConversation(userId: string, otherUserId: string): Promise<MessageResponseDto[]> {
    const messages = await this.prisma.message.findMany({
      where: {
        OR: [
          {
            senderId: userId,
            receiverId: otherUserId,
          },
          {
            senderId: otherUserId,
            receiverId: userId,
          },
        ],
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    return Promise.all(messages.map(message => this.formatMessageResponse(message)));
  }

  async findOne(id: string, userId: string): Promise<MessageResponseDto> {
    const message = await this.prisma.message.findUnique({
      where: { id },
    });

    if (!message) {
      throw new NotFoundException(`Message with ID ${id} not found`);
    }

    // Check if the user is either the sender or receiver
    if (message.senderId !== userId && message.receiverId !== userId) {
      throw new ForbiddenException('You do not have permission to access this message');
    }

    return this.formatMessageResponse(message);
  }

  async update(id: string, userId: string, updateMessageDto: UpdateMessageDto): Promise<MessageResponseDto> {
    // First check if the message exists
    const message = await this.prisma.message.findUnique({
      where: { id },
    });

    if (!message) {
      throw new NotFoundException(`Message with ID ${id} not found`);
    }

    // Only the sender can update the content
    if (updateMessageDto.content && message.senderId !== userId) {
      throw new ForbiddenException('Only the sender can update the message content');
    }

    // Only the receiver can mark as read
    if (updateMessageDto.isRead !== undefined && message.receiverId !== userId) {
      throw new ForbiddenException('Only the receiver can mark the message as read');
    }

    // Update the message
    const updatedMessage = await this.prisma.message.update({
      where: { id },
      data: updateMessageDto,
    });

    return this.formatMessageResponse(updatedMessage);
  }

  async remove(id: string, userId: string): Promise<void> {
    // First check if the message exists
    const message = await this.prisma.message.findUnique({
      where: { id },
    });

    if (!message) {
      throw new NotFoundException(`Message with ID ${id} not found`);
    }

    // Only the sender or receiver can delete the message
    if (message.senderId !== userId && message.receiverId !== userId) {
      throw new ForbiddenException('You do not have permission to delete this message');
    }

    await this.prisma.message.delete({
      where: { id },
    });
  }

  async markAsRead(id: string, userId: string): Promise<MessageResponseDto> {
    // First check if the message exists
    const message = await this.prisma.message.findUnique({
      where: { id },
    });

    if (!message) {
      throw new NotFoundException(`Message with ID ${id} not found`);
    }

    // Only the receiver can mark as read
    if (message.receiverId !== userId) {
      throw new ForbiddenException('Only the receiver can mark the message as read');
    }

    // Update the message
    const updatedMessage = await this.prisma.message.update({
      where: { id },
      data: { isRead: true },
    });

    return this.formatMessageResponse(updatedMessage);
  }

  async getUnreadCount(userId: string): Promise<number> {
    return this.prisma.message.count({
      where: {
        receiverId: userId,
        isRead: false,
      },
    });
  }

  private async formatMessageResponse(message: any): Promise<MessageResponseDto> {
    const { id, content, createdAt, updatedAt, isRead, senderId, receiverId } = message;

    // Basic response without expanded user details
    const response: MessageResponseDto = {
      id,
      content,
      createdAt,
      updatedAt,
      isRead,
      senderId,
      receiverId,
    };

    return response;
  }

  async getExpandedMessage(id: string, userId: string): Promise<MessageResponseDto> {
    const message = await this.prisma.message.findUnique({
      where: { id },
      include: {
        sender: {
          include: {
            doctor: true,
            clinic: true,
            patient: true,
          },
        },
        receiver: {
          include: {
            doctor: true,
            clinic: true,
            patient: true,
          },
        },
      },
    });

    if (!message) {
      throw new NotFoundException(`Message with ID ${id} not found`);
    }

    // Check if the user is either the sender or receiver
    if (message.senderId !== userId && message.receiverId !== userId) {
      throw new ForbiddenException('You do not have permission to access this message');
    }

    // Format the expanded response
    const response: MessageResponseDto = {
      id: message.id,
      content: message.content,
      createdAt: message.createdAt,
      updatedAt: message.updatedAt,
      isRead: message.isRead,
      senderId: message.senderId,
      receiverId: message.receiverId,
      sender: {
        id: message.sender.id,
        email: message.sender.email,
        role: message.sender.role,
      },
      receiver: {
        id: message.receiver.id,
        email: message.receiver.email,
        role: message.receiver.role,
      },
    };

    // Add doctor details if available
    if (message.sender.doctor) {
      if (response.sender && message.sender?.doctor) {
        response.sender.doctor = {
          id: message.sender.doctor.id,
          name: message.sender.doctor.name,
          surname: message.sender.doctor.surname,
        };
      }
    }

    if (message.receiver.doctor) {
      if (response.receiver && message.receiver?.doctor) {
        response.receiver.doctor = {
          id: message.receiver.doctor.id,
          name: message.receiver.doctor.name,
          surname: message.receiver.doctor.surname,
        };
      }
    }

    // Add clinic details if available
    if (message.sender.clinic) {
      if (response.sender && message.sender?.clinic) {
        response.sender.clinic = {
          id: message.sender.clinic.id,
          name: message.sender.clinic.name,
        };
      }
    }

    if (message.receiver.clinic) {
      if (response.receiver && message.receiver?.clinic) {
        response.receiver.clinic = {
          id: message.receiver.clinic.id,
          name: message.receiver.clinic.name,
        };
      }
    }

    // Add patient details if available
    if (message.sender.patient) {
      if (response.sender && message.sender?.patient) {
        response.sender.patient = {
          id: message.sender.patient.id,
          name: message.sender.patient.name,
          surname: message.sender.patient.surname,
        };
      }
    }

    if (message.receiver.patient) {
      if (response.receiver && message.receiver?.patient) {
        response.receiver.patient = {
          id: message.receiver.patient.id,
          name: message.receiver.patient.name,
          surname: message.receiver.patient.surname,
        };
      }
    }

    return response;
  }
}
