import React, { useState, useEffect } from "react";
import Image from "next/image";
import { FaSearch, FaPlus } from "react-icons/fa";
import { startConversation } from "../services/chatService";
import { getProfile, ProfileResponse } from "../services/authService";

interface User {
  id: string;
  name: string;
  role: string;
  image?: string;
}

interface NewConversationProps {
  onConversationCreated: (conversationId: string) => void;
}

const NewConversation: React.FC<NewConversationProps> = ({
  onConversationCreated,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [profile, setProfile] = useState<ProfileResponse | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await getProfile();
        setProfile(profileData);

        const mockUsers: User[] = [
          { id: "1", name: "Dr. João Silva", role: "DOCTOR", image: "" },
          { id: "2", name: "Dra. Maria Oliveira", role: "DOCTOR", image: "" },
          { id: "3", name: "Pedro Santos", role: "PATIENT", image: "" },
          { id: "4", name: "Ana Souza", role: "PATIENT", image: "" },
        ];

        const filteredMockUsers = mockUsers.filter((user) => {
          if (profileData.user?.role === "DOCTOR" && user.role === "DOCTOR") {
            return profileData.doctor?.id !== user.id;
          } else if (
            profileData.user?.role === "PATIENT" &&
            user.role === "PATIENT"
          ) {
            return profileData.patient?.id !== user.id;
          }
          return true;
        });

        setUsers(filteredMockUsers);
        setFilteredUsers(filteredMockUsers);
      } catch (err: any) {
        setError(err.message || "Erro ao carregar perfil");
      }
    };

    fetchProfile();
  }, []);

  useEffect(() => {
    const filtered = users.filter((user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );
    setFilteredUsers(filtered);
  }, [searchTerm, users]);

  const handleStartConversation = async (userId: string) => {
    try {
      setLoading(true);
      const conversation = await startConversation(userId);
      onConversationCreated(conversation.id);
    } catch (err: any) {
      setError(err.message || "Erro ao iniciar conversa");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold text-[#2D39A6] mb-4">
        Nova Conversa
      </h2>

      <div className="relative mb-4">
        <input
          type="text"
          placeholder="Buscar usuário..."
          className="w-full p-2 pl-8 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2D39A6]"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <FaSearch className="absolute left-2 top-3 text-gray-400" />
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="space-y-2">
        {filteredUsers.length === 0 ? (
          <p className="text-gray-500 text-center">Nenhum usuário encontrado</p>
        ) : (
          filteredUsers.map((user) => (
            <div
              key={user.id}
              className="flex items-center justify-between p-3 border border-gray-200 rounded-md hover:bg-gray-50"
            >
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-gray-300 flex-shrink-0 overflow-hidden">
                  {user.image ? (
                    <Image
                      src={user.image}
                      alt={user.name}
                      width={40}
                      height={40}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-[#2D39A6] text-white text-lg font-semibold">
                      {user.name.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="ml-3">
                  <h3 className="font-medium">{user.name}</h3>
                  <p className="text-xs text-gray-500">
                    {user.role === "DOCTOR" ? "Médico" : "Paciente"}
                  </p>
                </div>
              </div>
              <button
                className="bg-[#2D39A6] text-white p-2 rounded-full hover:bg-[#252d7a] transition-colors"
                onClick={() => handleStartConversation(user.id)}
                disabled={loading}
              >
                <FaPlus size={14} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NewConversation;
