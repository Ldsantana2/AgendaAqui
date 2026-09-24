import React, { useState } from "react";
import Image from "next/image";
import { FaEdit } from "react-icons/fa";
import { useMessage } from "../context/MessageContext";
import LoadingOverlay from "./LoadingOverlay";

interface PersonalInfoProps {
  doctorId?: string;
  title: string;
  name: string;
  surname: string;
  about: string;
  gender: string;
  profilePicture: string;
  dateOfBirth?: string;
  completionIndicator?: React.ReactNode;
  onUpdate?: () => void;
}

const PersonalInfo: React.FC<PersonalInfoProps> = ({
  doctorId,
  title,
  name,
  surname,
  about,
  gender,
  profilePicture,
  dateOfBirth,
  completionIndicator,
  onUpdate,
}) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [editedName, setEditedName] = useState<string>(name);
  const [editedSurname, setEditedSurname] = useState<string>(surname);
  const [editedAbout, setEditedAbout] = useState<string>(about);
  const [editedGender, setEditedGender] = useState<string>(gender);

  const messageApi = useMessage();

  const defaultProfilePicture = "/images/user_icon_001.jpg";
  const imageToShow = profilePicture?.trim()
    ? profilePicture
    : defaultProfilePicture;
  const [newProfilePicture, setNewProfilePicture] =
    useState<string>(imageToShow);

  const handleEdit = () => setIsEditing(true);

  const handleSave = async () => {
    try {
      setIsLoading(true);
      setIsEditing(false);
      messageApi.success("Informações pessoais atualizadas com sucesso!");
      if (onUpdate) {
        onUpdate();
      }
    } catch (error) {
      messageApi.error("Erro ao atualizar informações pessoais.");
      console.error("Error updating personal info:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDiscard = () => {
    setIsEditing(false);
    setEditedName(name);
    setEditedSurname(surname);
    setEditedAbout(about);
    setEditedGender(gender);
    setNewProfilePicture(imageToShow);
  };

  const displayGender =
    gender === "masculino"
      ? "Masculino"
      : gender === "feminino"
        ? "Feminino"
        : gender === "outros"
          ? "Outros"
          : "Não informado";
  if (isLoading) return <LoadingOverlay />;
  return (
    <div className="p-6 bg-white rounded-lg shadow-lg w-full h-full flex flex-col relative">
      {/* Título separado no topo */}
      <div className="flex items-center mb-4">
        <h2 className="text-xl font-semibold text-[#2D39A6] mr-2">
          Informações Pessoais
        </h2>
        {completionIndicator}
      </div>

      {/* Foto de perfil abaixo do título, à esquerda */}
      <div className="flex items-center mb-4">
        <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-300 mr-4">
          <Image
            src={newProfilePicture}
            alt="Foto de perfil"
            width={96}
            height={96}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      <div className="flex-grow">
        {/* Título + Gênero */}
        <div className="flex space-x-4 mb-4">
          {title !== null && (
            <div className="w-1/2">
              <label className="block text-sm font-medium text-gray-700">
                Título
              </label>
              <p>{title}</p>
            </div>
          )}
          <div className="w-1/2">
            <label className="block text-sm font-medium text-gray-700">
              Nome
            </label>
            {isEditing ? (
              <input
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            ) : (
              <p>{name}</p>
            )}
          </div>
          <div className="w-1/2">
            <label className="block text-sm font-medium text-gray-700">
              Sobrenome
            </label>
            {isEditing ? (
              <input
                value={editedSurname}
                onChange={(e) => setEditedSurname(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            ) : (
              <p>{surname}</p>
            )}
          </div>
        </div>

        {/* Nome + Sobrenome */}
        <div className="flex space-x-4">
          <div className={title !== null ? "w-1/2" : "w-full"}>
            <label className="block text-sm font-medium text-gray-700">
              Gênero
            </label>
            {isEditing ? (
              <select
                value={editedGender}
                onChange={(e) => setEditedGender(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="">Selecione...</option>
                <option value="masculino">Masculino</option>
                <option value="feminino">Feminino</option>
                <option value="outros">Outros</option>
              </select>
            ) : (
              <p>{displayGender}</p>
            )}
          </div>
        </div>

        {/* Data de Nascimento */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700">
            Data de Nascimento
          </label>
          <p>
            {dateOfBirth
              ? new Date(dateOfBirth).toLocaleDateString("pt-BR")
              : "Não informado"}
          </p>
        </div>

        {/* Sobre mim */}
        {about !== null && (
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">
              Sobre mim
            </label>
            {isEditing ? (
              <textarea
                value={editedAbout}
                onChange={(e) => setEditedAbout(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md"
                rows={4}
              />
            ) : (
              <p>{about?.trim() ? about : "Não informado"}</p>
            )}
          </div>
        )}
      </div>

      {isEditing && (
        <div className="flex justify-end space-x-4 mt-4">
          <button
            onClick={handleDiscard}
            disabled={isLoading}
            className="p-2 bg-white text-gray-700 rounded-md shadow-md hover:bg-gray-100 disabled:opacity-50"
          >
            Descartar
          </button>
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="p-2 bg-green-500 text-white rounded-md shadow-md hover:bg-green-600 disabled:opacity-50"
          >
            {isLoading ? "Salvando..." : "Salvar"}
          </button>
        </div>
      )}
    </div>
  );
};

export default PersonalInfo;
