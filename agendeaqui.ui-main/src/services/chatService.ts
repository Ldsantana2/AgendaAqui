// services/chatService.ts

import { getToken } from './authService';
import api from './api';

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  read: boolean;
}

export interface Conversation {
  id: string;
  participantId: string;
  participantName: string;
  participantRole: string;
  participantImage?: string;
  lastMessage?: Message;
  unreadCount: number;
}

export interface MessageResponseDto {
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
      profileImage?: string;
    };
    clinic?: {
      id: string;
      name: string;
      profileImage?: string;
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
      profileImage?: string;
    };
    clinic?: {
      id: string;
      name: string;
      profileImage?: string;
    };
    patient?: {
      id: string;
      name: string;
      surname: string;
    };
  };
}

// Dados mockados para conversas
const mockConversations: Conversation[] = [
  {
    id: '1',
    participantId: '101',
    participantName: 'Dr. João Silva',
    participantRole: 'DOCTOR',
    participantImage: '',
    lastMessage: {
      id: 'm1',
      senderId: '101',
      receiverId: 'current-user',
      content: 'Olá, como posso ajudar?',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      read: true
    },
    unreadCount: 0
  },
  {
    id: '2',
    participantId: '102',
    participantName: 'Maria Oliveira',
    participantRole: 'PATIENT',
    participantImage: '',
    lastMessage: {
      id: 'm2',
      senderId: '102',
      receiverId: 'current-user',
      content: 'Preciso remarcar minha consulta',
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      read: false
    },
    unreadCount: 2
  },
  {
    id: '3',
    participantId: '103',
    participantName: 'Dra. Ana Souza',
    participantRole: 'DOCTOR',
    participantImage: '',
    lastMessage: {
      id: 'm3',
      senderId: 'current-user',
      receiverId: '103',
      content: 'Obrigado pelas informações',
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      read: true
    },
    unreadCount: 0
  }
];

// Obter todas as conversas do usuário
export const getConversations = async (): Promise<Conversation[]> => {
  try {
    const token = getToken();

    if (!token) {
      throw new Error("Usuário não autenticado");
    }

    // Fazer a requisição para a API
    const response = await api.get('/messages', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    // Verificar se a resposta foi bem-sucedida
    if (response.status !== 200) {
      throw new Error("Erro ao buscar conversas");
    }

    // Extrair os dados da resposta
    const responseData = response.data;
    const conversations: MessageResponseDto[] = responseData.data || responseData;

    // Converter para o formato esperado pela aplicação
    const allConversations = conversations.map(conv => {
      // Determine if the current user is the sender or receiver
      const isSender = conv.senderId === 'current-user';

      // Get the other participant's information
      const participant = isSender ? conv.receiver : conv.sender;

      // Extract participant name and image based on their role
      let participantName = 'Usuário';
      let participantImage = '';
      let participantRole = participant?.role || '';

      if (participant) {
        if (participant.doctor) {
          participantName = `${participant.doctor.name} ${participant.doctor.surname}`;
          participantImage = participant.doctor.profileImage || '';
        } else if (participant.clinic) {
          participantName = participant.clinic.name;
          participantImage = participant.clinic.profileImage || '';
        } else if (participant.patient) {
          participantName = `${participant.patient.name} ${participant.patient.surname}`;
        }
      }

      return {
        id: conv.id,
        participantId: isSender ? conv.receiverId : conv.senderId,
        participantName,
        participantRole,
        participantImage,
        lastMessage: {
          id: conv.id,
          senderId: conv.senderId,
          receiverId: conv.receiverId,
          content: conv.content,
          timestamp: conv.createdAt.toString(),
          read: conv.isRead
        },
        unreadCount: conv.isRead ? 0 : 1
      };
    });

    console.log('Conversas recebidas da API:', allConversations);

    return allConversations;
  } catch (error) {
    console.error("Erro ao buscar conversas:", error);

    // Em caso de erro, retornar as conversas mockadas para não quebrar a aplicação
    return [...mockConversations];
  }
};

// Dados mockados para mensagens por conversa
const mockMessages: Record<string, Message[]> = {
  '1': [
    {
      id: 'm1-1',
      senderId: '101',
      receiverId: 'current-user',
      content: 'Olá, como posso ajudar?',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      read: true
    },
    {
      id: 'm1-2',
      senderId: 'current-user',
      receiverId: '101',
      content: 'Gostaria de confirmar minha consulta de amanhã',
      timestamp: new Date(Date.now() - 3500000).toISOString(),
      read: true
    },
    {
      id: 'm1-3',
      senderId: '101',
      receiverId: 'current-user',
      content: 'Claro, sua consulta está confirmada para amanhã às 14h',
      timestamp: new Date(Date.now() - 3400000).toISOString(),
      read: true
    }
  ],
  '2': [
    {
      id: 'm2-1',
      senderId: '102',
      receiverId: 'current-user',
      content: 'Bom dia doutor',
      timestamp: new Date(Date.now() - 7300000).toISOString(),
      read: true
    },
    {
      id: 'm2-2',
      senderId: '102',
      receiverId: 'current-user',
      content: 'Preciso remarcar minha consulta',
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      read: false
    },
    {
      id: 'm2-3',
      senderId: '102',
      receiverId: 'current-user',
      content: 'Estou com um imprevisto',
      timestamp: new Date(Date.now() - 7100000).toISOString(),
      read: false
    }
  ],
  '3': [
    {
      id: 'm3-1',
      senderId: '103',
      receiverId: 'current-user',
      content: 'Aqui estão os resultados dos seus exames',
      timestamp: new Date(Date.now() - 90000000).toISOString(),
      read: true
    },
    {
      id: 'm3-2',
      senderId: '103',
      receiverId: 'current-user',
      content: 'Tudo está dentro dos parâmetros normais',
      timestamp: new Date(Date.now() - 89000000).toISOString(),
      read: true
    },
    {
      id: 'm3-3',
      senderId: 'current-user',
      receiverId: '103',
      content: 'Obrigado pelas informações',
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      read: true
    }
  ]
};

// Obter mensagens de uma conversa específica
export const getMessages = async (conversationId: string): Promise<Message[]> => {
  try {
    const token = getToken();

    if (!token) {
      throw new Error("Usuário não autenticado");
    }

    // Fazer a requisição para a API
    const response = await api.get('/messages', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    // Verificar se a resposta foi bem-sucedida
    if (response.status !== 200) {
      throw new Error("Erro ao buscar mensagens");
    }

    // Extrair os dados da resposta
    // A API retorna um objeto com a propriedade 'data' que contém o array de mensagens
    const responseData = response.data;
    const messages: MessageResponseDto[] = responseData.data || responseData;

    // Converter para o formato esperado pela aplicação
    const allMessages = messages.map(msg => ({
      id: msg.id,
      senderId: msg.senderId,
      receiverId: msg.receiverId,
      content: msg.content,
      timestamp: msg.createdAt.toString(),
      read: msg.isRead
    }));

    console.log('Mensagens recebidas da API:', allMessages);

    return allMessages;
  } catch (error) {
    console.error("Erro ao buscar mensagens:", error);

    // Em caso de erro, retornar as mensagens mockadas para não quebrar a aplicação
    // Isso pode ser removido quando a API estiver funcionando corretamente
    return [...(mockMessages[conversationId] || [])];
  }
};

// Enviar uma nova mensagem
export const sendMessage = async (receiverId: string, content: string): Promise<Message> => {
  // Verificar token para manter a consistência com o comportamento real
  const token = getToken();

  if (!token) {
    throw new Error("Usuário não autenticado");
  }

  // Simulando um delay de rede
  await new Promise(resolve => setTimeout(resolve, 300));

  // Criar uma nova mensagem com ID único
  const newMessage: Message = {
    id: `m-${Date.now()}`,
    senderId: 'current-user',
    receiverId: receiverId,
    content: content,
    timestamp: new Date().toISOString(),
    read: false
  };

  // Encontrar a conversa correspondente
  const conversation = mockConversations.find(conv => conv.participantId === receiverId);

  if (conversation) {
    // Atualizar a última mensagem da conversa
    conversation.lastMessage = newMessage;

    // Adicionar a mensagem ao histórico de mensagens
    if (mockMessages[conversation.id]) {
      mockMessages[conversation.id].push(newMessage);
    } else {
      mockMessages[conversation.id] = [newMessage];
    }
  }

  return newMessage;
};

// Marcar mensagens como lidas
export const markMessagesAsRead = async (conversationId: string): Promise<void> => {
  // Verificar token para manter a consistência com o comportamento real
  const token = getToken();

  if (!token) {
    throw new Error("Usuário não autenticado");
  }

  // Simulando um delay de rede
  await new Promise(resolve => setTimeout(resolve, 200));

  // Encontrar a conversa
  const conversation = mockConversations.find(conv => conv.id === conversationId);

  if (conversation) {
    // Zerar contador de mensagens não lidas
    conversation.unreadCount = 0;

    // Marcar todas as mensagens como lidas
    if (mockMessages[conversationId]) {
      mockMessages[conversationId] = mockMessages[conversationId].map(msg => {
        if (msg.receiverId === 'current-user' && !msg.read) {
          return { ...msg, read: true };
        }
        return msg;
      });
    }
  }
};

// Iniciar uma nova conversa com um usuário
export const startConversation = async (participantId: string): Promise<Conversation> => {
  // Verificar token para manter a consistência com o comportamento real
  const token = getToken();

  if (!token) {
    throw new Error("Usuário não autenticado");
  }

  // Simulando um delay de rede
  await new Promise(resolve => setTimeout(resolve, 500));

  // Verificar se já existe uma conversa com este participante
  const existingConversation = mockConversations.find(conv => conv.participantId === participantId);

  if (existingConversation) {
    return existingConversation;
  }

  // Criar uma nova conversa
  const newConversation: Conversation = {
    id: `conv-${Date.now()}`,
    participantId: participantId,
    participantName: `Usuário ${participantId}`, // Nome genérico, seria substituído por dados reais
    participantRole: participantId.startsWith('1') ? 'DOCTOR' : 'PATIENT', // Lógica simples para determinar o papel
    participantImage: '',
    unreadCount: 0
  };

  // Adicionar à lista de conversas
  mockConversations.push(newConversation);

  // Inicializar o array de mensagens para esta conversa
  mockMessages[newConversation.id] = [];

  return newConversation;
};
