export class MessageResponseDto {
  id: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  isRead: boolean;
  senderId: string;
  receiverId: string;
  
  // Optional fields for expanded responses
  sender?: {
    id: string;
    email: string;
    role: string;
    doctor?: {
      id: string;
      name: string;
      surname: string;
    };
    clinic?: {
      id: string;
      name: string;
    };
    patient?: {
      id: string;
      name: string;
      surname: string;
    };
  };
  
  receiver?: {
    id: string;
    email: string;
    role: string;
    doctor?: {
      id: string;
      name: string;
      surname: string;
    };
    clinic?: {
      id: string;
      name: string;
    };
    patient?: {
      id: string;
      name: string;
      surname: string;
    };
  };
}