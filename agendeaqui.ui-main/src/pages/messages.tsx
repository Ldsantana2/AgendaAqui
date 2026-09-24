import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import {
  FaPaperPlane,
  FaSearch,
  FaPlus,
  FaTimes,
  FaArrowLeft,
} from "react-icons/fa";
import {
  getConversations,
  getMessages,
  sendMessage,
  markMessagesAsRead,
  Conversation,
  Message,
} from "../services/chatService";
import { getProfile, ProfileResponse } from "../services/authService";
import NewConversation from "../components/NewConversation";
import LoadingOverlay from "../components/LoadingOverlay"; // 👈 NOVO: Importação do componente de loading

export default function MessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [profile, setProfile] = useState<ProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showNewConversation, setShowNewConversation] = useState(false);
  const [showConversationList, setShowConversationList] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const profileData = await getProfile();
        console.log(profileData);
        setProfile(profileData);

        const conversationsData = await getConversations();
        console.log(conversationsData);
        setConversations(conversationsData);
      } catch (err: any) {
        setError(err.message || "Erro ao carregar dados");
        console.error("Erro ao carregar dados:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (selectedConversation) {
      const fetchMessages = async () => {
        try {
          const messagesData = await getMessages(selectedConversation.id);
          setMessages(messagesData);
          if (selectedConversation.unreadCount > 0) {
            await markMessagesAsRead(selectedConversation.id);

            setConversations((prevConversations) =>
              prevConversations.map((conv) =>
                conv.id === selectedConversation.id
                  ? { ...conv, unreadCount: 0 }
                  : conv,
              ),
            );
          }
        } catch (err: any) {
          console.error("Erro ao carregar mensagens:", err);
        }
      };

      fetchMessages();
    }
  }, [selectedConversation]);

  const [shouldScrollToBottom, setShouldScrollToBottom] = useState(true);

  useEffect(() => {
    if (shouldScrollToBottom) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      setShouldScrollToBottom(false);
    }
  }, [messages, shouldScrollToBottom]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;

    try {
      const sentMessage = await sendMessage(
        selectedConversation.participantId,
        newMessage,
      );

      setMessages((prev) => [...prev, sentMessage]);

      setShouldScrollToBottom(true);

      setConversations((prevConversations) =>
        prevConversations.map((conv) =>
          conv.id === selectedConversation.id
            ? { ...conv, lastMessage: sentMessage }
            : conv,
        ),
      );

      setNewMessage("");
    } catch (err: any) {
      console.error("Erro ao enviar mensagem:", err);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleNewConversationCreated = (conversationId: string) => {
    const fetchConversations = async () => {
      try {
        const conversationsData = await getConversations();
        setConversations(conversationsData);

        const newConversation = conversationsData.find(
          (conv) => conv.id === conversationId,
        );
        if (newConversation) {
          setSelectedConversation(newConversation);
          setShowConversationList(false);
          setShouldScrollToBottom(true);
        }

        setShowNewConversation(false);
      } catch (err: any) {
        console.error("Erro ao recarregar conversas:", err);
      }
    };

    fetchConversations();
  };

  const filteredConversations = conversations.filter((conv) =>
    conv.participantName.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingOverlay /> {/* 👈 ALTERADO: Usa o componente LoadingOverlay */}
      </div>
    );
  if (error)
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const isCurrentUser = (senderId: string) => {
    return profile && profile.user && senderId === profile.user.id;
  };

  return (
    <div className="bg-gray-100 min-h-screen pb-8">
      <div className="container mx-auto p-4">
        {/* Modal de nova conversa */}
        {showNewConversation && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md relative">
              <button
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                onClick={() => setShowNewConversation(false)}
              >
                <FaTimes size={20} />
              </button>
              <NewConversation
                onConversationCreated={handleNewConversationCreated}
              />
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="h-[calc(100vh-4rem)]">
            {showConversationList ? (
              /* Lista de conversas */
              <div className="h-full">
                <div
                  className="p-4 border-b border-gray-200"
                  style={{
                    position: "sticky",
                    top: 0,
                    backgroundColor: "white",
                    zIndex: 2,
                  }}
                >
                  <div className="flex justify-between items-center mb-3">
                    <h2 className="text-xl font-semibold text-[#2D39A6]">
                      Mensagens
                    </h2>
                    <button
                      className="bg-[#2D39A6] text-white p-2 rounded-full hover:bg-[#252d7a] transition-colors"
                      onClick={() => setShowNewConversation(true)}
                      aria-label="Nova conversa"
                    >
                      <FaPlus size={14} />
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Buscar conversa..."
                      className="w-full p-2 pl-8 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2D39A6]"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <FaSearch className="absolute left-2 top-3 text-gray-400" />
                  </div>
                </div>
                <div className="overflow-y-auto h-[calc(100%-5rem)]">
                  {filteredConversations.length === 0 ? (
                    <div className="p-4 text-center text-[#2D39A6]">
                      Nenhuma conversa encontrada
                    </div>
                  ) : (
                    filteredConversations.map((conv) => (
                      <div
                        key={conv.id}
                        className={`p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors ${
                          selectedConversation?.id === conv.id
                            ? "bg-gray-100"
                            : ""
                        }`}
                        onClick={() => {
                          setSelectedConversation(conv);
                          setShowConversationList(false);
                        }}
                      >
                        <div className="flex items-center">
                          <div className="w-12 h-12 rounded-full bg-gray-300 flex-shrink-0 overflow-hidden">
                            {conv.participantImage ? (
                              <Image
                                src={conv.participantImage}
                                alt={conv.participantName}
                                width={48}
                                height={48}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-[#2D39A6] text-white text-xl font-semibold">
                                {conv.participantName.charAt(0)}
                              </div>
                            )}
                          </div>
                          <div className="ml-3 flex-grow">
                            <div className="flex justify-between items-center">
                              <h3 className="font-medium">
                                {conv.participantName}
                              </h3>
                              {conv.unreadCount > 0 && (
                                <span className="bg-[#2D39A6] text-white text-xs px-2 py-1 rounded-full">
                                  {conv.unreadCount}
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-500 truncate">
                              {conv.lastMessage?.content || "Nenhuma mensagem"}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ) : (
              /* Área de mensagens */
              <div className="h-full flex flex-col">
                {selectedConversation ? (
                  <>
                    {/* Cabeçalho da conversa */}
                    <div
                      className="p-4 border-b border-gray-200 flex items-center"
                      style={{
                        position: "sticky",
                        top: 0,
                        backgroundColor: "white",
                        zIndex: 2,
                      }}
                    >
                      <button
                        className="mr-3 text-gray-600 hover:text-[#2D39A6] transition-colors"
                        onClick={() => setShowConversationList(true)}
                        aria-label="Voltar para lista de conversas"
                      >
                        <FaArrowLeft size={16} />
                      </button>
                      <div className="w-10 h-10 rounded-full bg-gray-300 flex-shrink-0 overflow-hidden">
                        {selectedConversation.participantImage ? (
                          <Image
                            src={selectedConversation.participantImage}
                            alt={selectedConversation.participantName}
                            width={40}
                            height={40}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-[#2D39A6] text-white text-lg font-semibold">
                            {selectedConversation.participantName.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div className="ml-3">
                        <h3 className="font-medium">
                          {selectedConversation.participantName}
                        </h3>
                        <p className="text-xs text-gray-500">
                          {selectedConversation.participantRole === "DOCTOR"
                            ? "Médico"
                            : "Paciente"}
                        </p>
                      </div>
                    </div>

                    {/* Mensagens */}
                    <div
                      className="flex-grow overflow-y-auto p-4 bg-gray-50"
                      style={{ position: "relative", zIndex: 1 }}
                    >
                      {messages.length === 0 ? (
                        <div className="flex items-center justify-center h-full text-gray-500">
                          Nenhuma mensagem. Comece a conversar!
                        </div>
                      ) : (
                        messages.map((msg) => (
                          <div
                            key={msg.id}
                            className={`mb-4 flex ${
                              isCurrentUser(msg.senderId)
                                ? "justify-end"
                                : "justify-start"
                            }`}
                          >
                            <div
                              className={`max-w-[70%] p-3 rounded-lg ${
                                isCurrentUser(msg.senderId)
                                  ? "bg-[#2D39A6] text-white rounded-tr-none"
                                  : "bg-white border border-gray-200 rounded-tl-none"
                              }`}
                            >
                              <p>{msg.content}</p>
                              <p
                                className={`text-xs mt-1 text-right ${
                                  isCurrentUser(msg.senderId)
                                    ? "text-[#aec3ff]"
                                    : "text-gray-500"
                                }`}
                              >
                                {formatDate(msg.timestamp)}
                              </p>
                            </div>
                          </div>
                        ))
                      )}
                      <div ref={messagesEndRef} />
                    </div>

                    {/* Campo de entrada de mensagem. */}
                    <div className="p-4 border-t border-gray-200">
                      <div className="flex">
                        <textarea
                          className="flex-grow p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-[#2D39A6] resize-none"
                          placeholder="Digite sua mensagem..."
                          rows={2}
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          onKeyDown={handleKeyPress}
                        />
                        <button
                          className="bg-[#2D39A6] text-white px-4 rounded-r-md hover:bg-[#252d7a] transition-colors flex items-center justify-center"
                          onClick={handleSendMessage}
                          disabled={!newMessage.trim()}
                        >
                          <FaPaperPlane />
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    Selecione uma conversa para começar
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
