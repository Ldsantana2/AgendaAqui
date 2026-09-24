import React, { useState, useEffect } from "react";
import { FaEdit } from "react-icons/fa";
import {
  updateDoctorSpecialties,
  useFetchSpecialtiesQuery,
} from "../services/doctorService";
import { useMessage } from "../context/MessageContext";

interface Specialty {
  id: string;
  name: string;
}

interface SpecialtiesBoxProps {
  doctorId: string;
  savedSpecialties: Specialty[];
  completionIndicator?: React.ReactNode;
  onUpdate?: () => void;
}

const SpecialtiesBox: React.FC<SpecialtiesBoxProps> = ({
  doctorId,
  savedSpecialties,
  completionIndicator,
  onUpdate,
}) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);
  const [allSpecialties, setAllSpecialties] = useState<Specialty[]>([]);

  const messageApi = useMessage();
  const specialtiesQuery = useFetchSpecialtiesQuery();

  useEffect(() => {
    if (savedSpecialties) {
      setSelectedSpecialties(savedSpecialties.map((spec) => spec.id));
    }
  }, [savedSpecialties]);

  useEffect(() => {
    if (specialtiesQuery.data?.data) {
      setAllSpecialties(specialtiesQuery.data.data);
    }
  }, [specialtiesQuery.data]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      await updateDoctorSpecialties(doctorId, selectedSpecialties);
      setIsEditing(false);
      messageApi.success("Especialidades atualizadas com sucesso!");
      if (onUpdate) {
        onUpdate();
      }
    } catch (error) {
      messageApi.error("Erro ao atualizar especialidades.");
      console.error("Error updating specialties:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDiscard = () => {
    setIsEditing(false);
    setSelectedSpecialties(savedSpecialties.map((spec) => spec.id));
  };

  const toggleSpecialty = (specialtyId: string) => {
    if (selectedSpecialties.includes(specialtyId)) {
      setSelectedSpecialties(
        selectedSpecialties.filter((id) => id !== specialtyId),
      );
    } else {
      setSelectedSpecialties([...selectedSpecialties, specialtyId]);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg w-full h-full flex flex-col relative">
      <div className="flex items-center mb-2">
        <h2 className="text-xl font-semibold text-[#2D39A6] mr-2">
          Especialidades
        </h2>
        {completionIndicator}
      </div>

      {!isEditing ? (
        <button
          onClick={handleEdit}
          className="absolute top-4 right-4 text-gray-600 hover:text-blue-600 flex items-center"
        >
          <FaEdit className="mr-1" /> Editar
        </button>
      ) : null}

      <p className="text-sm text-gray-600 mb-4">
        Pacientes tendem a procurar profissionais com especialidades
        específicas. Mostre que você é a escolha certa.
      </p>
      <div className="flex-grow">
        {!isEditing ? (
          savedSpecialties.length > 0 ? (
            <ul className="list-disc list-inside text-gray-700">
              {savedSpecialties.map((spec, idx) => (
                <li key={idx}>{spec.name}</li>
              ))}
            </ul>
          ) : (
            <p>Não há especialidades selecionadas.</p>
          )
        ) : (
          <div>
            <p className="mb-2 text-sm font-medium text-gray-700">
              Selecione suas especialidades:
            </p>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {allSpecialties.map((specialty) => (
                <div key={specialty.id} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`specialty-${specialty.id}`}
                    checked={selectedSpecialties.includes(specialty.id)}
                    onChange={() => toggleSpecialty(specialty.id)}
                    className="mr-2"
                  />
                  <label htmlFor={`specialty-${specialty.id}`}>
                    {specialty.name}
                  </label>
                </div>
              ))}
            </div>
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

export default SpecialtiesBox;
