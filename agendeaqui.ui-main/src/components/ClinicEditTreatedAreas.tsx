import React, { useState, useEffect, Dispatch, SetStateAction } from "react";
import { Select, Tag } from "antd";
import type { SelectProps } from "antd";
import {
  addClinicTreatedArea,
  removeClinicTreatedArea,
  getClinicTreatedAreas,
} from "../services/TreatedAreasService";
import { TreatedArea } from "../entities/TreatedArea";
import { FaTimes } from "react-icons/fa";
import { useMessage } from "../context/MessageContext";

type ClinicEditTreatedAreasProps = {
  clinicId: string;
  treatedAreasList?: TreatedArea[];
  initialTreatedAreas: TreatedArea[];
  onChange: (updatedTreatedAreas: TreatedArea[]) => void;
  isEditingExternally?: boolean;
  onEditStateChange?: Dispatch<SetStateAction<boolean>>;
};

export default function ClinicEditTreatedAreas({
  clinicId,
  onChange,
  initialTreatedAreas,
  treatedAreasList = [],
  isEditingExternally,
  onEditStateChange,
}: ClinicEditTreatedAreasProps) {
  const [treatedAreas, setTreatedAreas] = useState<TreatedArea[]>([]);
  const [areaToRemove, setAreaToRemove] = useState<TreatedArea | null>(null);
  const [isRemoving, setIsRemoving] = useState(false);
  const [selectedAreaId, setSelectedAreaId] = useState<string | undefined>(
    undefined,
  );
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(isEditingExternally || false);
  const messageApi = useMessage();

  useEffect(() => {
    const fetchClinicTreatedAreas = async () => {
      if (!clinicId) return;
      try {
        const areas = await getClinicTreatedAreas(clinicId);
        setTreatedAreas(areas);
      } catch (error) {
        messageApi.error("Erro ao carregar as áreas tratadas da clínica.");
        console.error("Erro ao carregar as áreas tratadas:", error);
      }
    };
    fetchClinicTreatedAreas();
  }, [clinicId, messageApi]);

  useEffect(() => {
    setIsEditing(isEditingExternally || false);
  }, [isEditingExternally]);
  useEffect(() => {
    setTreatedAreas(initialTreatedAreas);
  }, [initialTreatedAreas]);
  const confirmRemoveArea = (area: TreatedArea) => {
    setAreaToRemove(area);
  };

  const cancelRemove = () => {
    setAreaToRemove(null);
  };

  const handleRemoveArea = async () => {
    if (!areaToRemove) return;
    setIsRemoving(true);
    try {
      await removeClinicTreatedArea(clinicId, areaToRemove.id);
      const updatedAreas = treatedAreas.filter((a) => a.id !== areaToRemove.id);
      setTreatedAreas(updatedAreas);
      onChange(updatedAreas);
      setAreaToRemove(null);
      messageApi.success("Área tratada removida com sucesso.");
    } catch (error) {
      messageApi.error("Erro ao remover área tratada.");
      console.error("Erro ao remover área tratada:", error);
    } finally {
      setIsRemoving(false);
    }
  };

  const handleAddArea = async () => {
    if (!selectedAreaId) return;

    if (treatedAreas.some((a) => a.id === selectedAreaId)) {
      setSelectedAreaId(undefined);
      messageApi.warning("Área já adicionada.");
      return;
    }

    setIsAdding(true);
    try {
      await addClinicTreatedArea(clinicId, selectedAreaId);

      const areaToAdd = treatedAreasList.find((a) => a.id === selectedAreaId);

      if (areaToAdd) {
        const updatedAreas = [...treatedAreas, areaToAdd];
        setTreatedAreas(updatedAreas);
        onChange(updatedAreas);
      }

      setSelectedAreaId(undefined);
      messageApi.success("Área tratada adicionada com sucesso.");
    } catch (error) {
      messageApi.error("Erro ao adicionar área tratada.");
      console.error("Erro ao adicionar área tratada:", error);
    } finally {
      setIsAdding(false);
    }
  };

  const availableAreas = (
    Array.isArray(treatedAreasList) ? treatedAreasList : []
  ).filter((a) => !treatedAreas.some((existing) => existing.id === a.id));

  const options = availableAreas
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((area) => ({
      value: area.id,
      label: area.name,
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
      {!isEditingExternally ? (
        <>
          {treatedAreas.length === 0 ? (
            <p className="text-gray-500 font-medium">
              Nenhuma área tratada cadastrada.
            </p>
          ) : (
            <ul className="list-inside text-gray-800 space-y-2 max-h-64 overflow-auto">
              {treatedAreas.map((area) => (
                <li key={area.id}>
                  <p className="text-black text-base font-medium">
                    {area.name}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </>
      ) : (
        <div className="space-y-4">
          <div className="mb-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex-1 max-w-xs">
                <Select
                  showSearch
                  value={selectedAreaId}
                  onChange={setSelectedAreaId}
                  placeholder="Selecione uma área tratada"
                  filterOption={filterOption}
                  options={options}
                  style={{ width: "100%", minHeight: 32 }}
                  disabled={isAdding}
                />
              </div>
              <button
                onClick={handleAddArea}
                className="px-4 py-2 rounded  bg-[#2D39A6] text-white hover: bg-[#2D39A6]-700 disabled:opacity-50"
                disabled={!selectedAreaId || isAdding}
                type="button"
              >
                {isAdding ? "Adicionando..." : "Adicionar"}
              </button>
            </div>
          </div>
          {treatedAreas.length === 0 ? (
            <p className="text-gray-500 font-medium">
              Nenhuma área tratada cadastrada.
            </p>
          ) : (
            <ul className="list-disc list-inside text-gray-800 space-y-2 max-h-64 overflow-auto">
              {treatedAreas.map((area) => (
                <li
                  key={area.id}
                  className="flex justify-between items-center pr-2"
                >
                  <span>{area.name}</span>
                  <button
                    className="text-red-600 hover:text-red-800"
                    onClick={() => confirmRemoveArea(area)}
                    aria-label="Remover área tratada"
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
      {areaToRemove && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-md shadow-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-4 text-[#2D39A6]">
              Confirmar remoção
            </h3>
            <p className="mb-6">
              Tem certeza que deseja remover a área tratada:{" "}
              <strong>{areaToRemove.name}</strong>?
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
                onClick={handleRemoveArea}
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
