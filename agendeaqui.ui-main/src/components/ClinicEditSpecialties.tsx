import { useState, useEffect, Dispatch, SetStateAction } from "react";
import {
  removeClinicSpecialty,
  addClinicSpecialty,
} from "../services/specialtyService";
import type { Specialty } from "../entities/specialty";
import { Select, Form } from "antd";
import { useMessage } from "../context/MessageContext";
import { FaEdit, FaTimes } from "react-icons/fa";

type ClinicEditSpecialtiesProps = {
  clinicId: string;
  initialSpecialties: Specialty[];
  onChange: (updatedSpecialties: Specialty[]) => void;
  specialtiesList?: Specialty[];
  isEditingExternally?: boolean;
  onEditStateChange?: Dispatch<SetStateAction<boolean>>;
};

export default function ClinicEditSpecialties({
  clinicId,
  initialSpecialties,
  onChange,
  specialtiesList = [],
  isEditingExternally,
  onEditStateChange,
}: ClinicEditSpecialtiesProps) {
  const [specialties, setSpecialties] =
    useState<Specialty[]>(initialSpecialties);
  const [specialtyToRemove, setSpecialtyToRemove] = useState<Specialty | null>(
    null,
  );
  const [isRemoving, setIsRemoving] = useState(false);
  const [selectedSpecialtyId, setSelectedSpecialtyId] = useState<
    string | undefined
  >(undefined);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(isEditingExternally || false);
  const [originalSpecialties, setOriginalSpecialties] =
    useState<Specialty[]>(initialSpecialties);
  const messageApi = useMessage();

  useEffect(() => {
    setIsEditing(isEditingExternally || false);

    if (!isEditingExternally) {
      setSpecialties([...originalSpecialties]);
    }
  }, [isEditingExternally, originalSpecialties]);
  useEffect(() => {
    setSpecialties(initialSpecialties);
  }, [initialSpecialties]);

  const confirmRemoveSpecialty = (specialty: Specialty) => {
    setSpecialtyToRemove(specialty);
  };

  const cancelRemove = () => {
    setSpecialtyToRemove(null);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setSelectedSpecialtyId(undefined);
    onEditStateChange?.(false);
  };

  const handleRemoveSpecialty = async () => {
    if (!specialtyToRemove) return;
    setIsRemoving(true);
    try {
      await removeClinicSpecialty(clinicId, specialtyToRemove.id);
      const updatedSpecialties = specialties.filter(
        (s) => s.id !== specialtyToRemove.id,
      );
      setSpecialties(updatedSpecialties);
      onChange(updatedSpecialties);
      setSpecialtyToRemove(null);
      messageApi.success("Especialidade removida com sucesso.");
    } catch (error) {
      messageApi.error("Erro ao remover especialidade.");
      console.error("Erro ao remover especialidade:", error);
    } finally {
      setIsRemoving(false);
    }
  };

  const handleAddSpecialty = async () => {
    if (!selectedSpecialtyId) return;

    if (specialties.some((s) => s.id === selectedSpecialtyId)) {
      setSelectedSpecialtyId(undefined);
      messageApi.warning("Especialidade já adicionada.");
      return;
    }

    setIsAdding(true);
    try {
      await addClinicSpecialty(clinicId, selectedSpecialtyId);

      const specialtyToAdd = specialtiesList.find(
        (s) => s.id === selectedSpecialtyId,
      );

      if (specialtyToAdd) {
        const updatedSpecialties = [...specialties, specialtyToAdd];
        setSpecialties(updatedSpecialties);
        onChange(updatedSpecialties);
      }

      setSelectedSpecialtyId(undefined);
      messageApi.success("Especialidade adicionada com sucesso.");
    } catch (error) {
      messageApi.error("Erro ao adicionar especialidade.");
      console.error("Erro ao adicionar especialidade:", error);
    } finally {
      setIsAdding(false);
    }
  };

  const availableSpecialties = specialtiesList.filter(
    (s) => !specialties.some((existing) => existing.id === s.id),
  );

  const options = availableSpecialties
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((specialty) => ({
      value: specialty.id,
      label: specialty.name,
    }));

  const filterOption = (
    input: string,
    option?: { label: string; value: string },
  ) => {
    const normalize = (str: string) =>
      str
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();
    return normalize(option?.label ?? "").includes(normalize(input));
  };

  return (
    <div className="space-y-4">
      {" "}
      {!isEditing ? (
        <>
          {specialties.length === 0 ? (
            <p className="text-gray-500 font-medium">
              Nenhuma especialidade cadastrada.
            </p>
          ) : (
            <ul className="list-disc list-inside text-gray-800 space-y-2 max-h-64 overflow-auto">
              {specialties.map((specialty) => (
                <li key={specialty.id}>
                  <p className="text-black text-base font-medium">
                    {specialty.name}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </>
      ) : (
        <div className="space-y-4">
          {/* Dropdown e botão de adicionar */}
          <div className="mb-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex-1 max-w-xs">
                <Select
                  showSearch
                  value={selectedSpecialtyId}
                  onChange={setSelectedSpecialtyId}
                  placeholder="Selecione uma especialidade"
                  filterOption={filterOption}
                  options={options}
                  style={{ width: "100%", minHeight: 32 }}
                  disabled={isAdding}
                />
              </div>
              <button
                onClick={handleAddSpecialty}
                className="px-4 py-2 rounded bg-[#2D39A6] text-white hover:bg-[#283277] disabled:opacity-50"
                disabled={!selectedSpecialtyId || isAdding}
                type="button"
              >
                {isAdding ? "Adicionando..." : "Adicionar"}
              </button>
            </div>
          </div>

          {specialties.length === 0 ? (
            <p className="text-gray-500 font-medium">
              Nenhuma especialidade cadastrada.
            </p>
          ) : (
            <ul className="list-disc list-inside text-gray-800 space-y-2 max-h-64 overflow-auto">
              {specialties.map((specialty) => (
                <li
                  key={specialty.id}
                  className="flex justify-between items-center pr-2"
                >
                  <span>{specialty.name}</span>
                  <button
                    className="text-red-600 hover:text-red-800"
                    onClick={() => confirmRemoveSpecialty(specialty)}
                    aria-label="Remover especialidade"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
      {specialtyToRemove && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-md shadow-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-4 text-[#2D39A6]">
              Confirmar remoção
            </h3>
            <p className="mb-6">
              Tem certeza que deseja remover a especialidade:{" "}
              <strong>{specialtyToRemove.name}</strong>?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={cancelRemove}
                className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100"
                disabled={isRemoving}
              >
                Cancelar
              </button>
              <button
                onClick={handleRemoveSpecialty}
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
                disabled={isRemoving}
              >
                {isRemoving ? "Removendo..." : "Remover"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
