"use client";

import {
  useEffect,
  useState,
  useCallback,
  Dispatch,
  SetStateAction,
} from "react";
import { FaEdit, FaTimes } from "react-icons/fa";
import {
  getAllHealthOperators,
  assignOperatorToClinic,
  removeOperatorFromClinic,
  getOperatorsByClinic,
} from "../services/clinicHealthOperatorService";
import { useMessage } from "../context/MessageContext";

interface ClinicEditHealthOperatorProps {
  clinicId: string;
  isEditingExternally: boolean;
  onEditStateChange: Dispatch<SetStateAction<boolean>>;
  onSave?: () => void;
  onCancel?: () => void;
}

export default function ClinicEditHealthOperator({
  clinicId,
  isEditingExternally,
  onEditStateChange,
  onSave,
  onCancel,
}: ClinicEditHealthOperatorProps) {
  const [operators, setOperators] = useState<any[]>([]);
  const [allOperators, setAllOperators] = useState<any[]>([]);
  //const [isEditing, setIsEditing] = useState(false);
  const [selectedOperatorId, setSelectedOperatorId] = useState<string>("");

  const messageApi = useMessage();

  const fetchOperators = useCallback(async () => {
    try {
      const res = await getOperatorsByClinic(clinicId);
      setOperators(Array.isArray(res) ? res : []);
    } catch {
      setOperators([]);
      messageApi.error("Erro ao carregar operadoras da clínica.");
    }
  }, [clinicId, messageApi]);

  const fetchAllOperators = useCallback(async () => {
    try {
      const res = await getAllHealthOperators();
      setAllOperators(res);
    } catch (err) {
      messageApi.error("Erro ao buscar operadores disponíveis.");
    }
  }, [messageApi]);

  useEffect(() => {
    if (clinicId) {
      fetchOperators();
    }
  }, [clinicId, fetchOperators]);

  useEffect(() => {
    if (isEditingExternally) {
      fetchAllOperators();
    } else {
      fetchOperators();
      setSelectedOperatorId("");
    }
  }, [isEditingExternally, fetchAllOperators, fetchOperators]);
  const handleAdd = async () => {
    if (!selectedOperatorId) return;
    try {
      await assignOperatorToClinic(clinicId, selectedOperatorId);
      await fetchOperators();
      setSelectedOperatorId("");
      messageApi.success("Operador adicionado com sucesso.");
      onSave && onSave();
    } catch (err: any) {
      messageApi.error(
        err.response?.data?.message || "Erro ao adicionar operador.",
      );
    }
  };

  const handleRemove = async (operatorId: string) => {
    try {
      await removeOperatorFromClinic(clinicId, operatorId);
      await fetchOperators();
      messageApi.success("Operador removido com sucesso.");
      onSave && onSave();
    } catch {
      messageApi.error("Erro ao remover operador.");
    }
  };

  return (
    <div className="space-y-4">
      {" "}
      {isEditingExternally && (
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
          <select
            value={selectedOperatorId}
            onChange={(e) => setSelectedOperatorId(e.target.value)}
            className="flex-1 max-w-xs border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-[#2D39A6] text-gray-700"
          >
            <option value="">Selecione um operador</option>
            {allOperators.map((op) => (
              <option key={op.id} value={op.id}>
                {op.operatorCompanyName}
              </option>
            ))}
          </select>
          <button
            className="bg-[#2D39A6] hover:bg-[#283277] text-white px-3 py-1.5 rounded disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleAdd}
            disabled={!selectedOperatorId}
          >
            Adicionar
          </button>
        </div>
      )}
      {/* Lista de Operadoras de Saúde */}
      {operators.length === 0 ? (
        <p className="text-gray-500 text-base font-normal">
          Nenhuma operadora cadastrada.
        </p>
      ) : (
        <ul className="list-disc list-inside text-gray-800 space-y-3 max-h-64 overflow-auto">
          {operators
            .filter((op) => op?.healthOperator)
            .map((op) => (
              <li
                key={op.healthOperator.id}
                className="flex justify-between items-center text-black text-base font-medium"
              >
                <span>{op.healthOperator.operatorCompanyName}</span>

                {isEditingExternally && (
                  <button
                    className="text-red-600 hover:underline text-sm ml-2"
                    onClick={() => handleRemove(op.healthOperator.id)}
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
                )}
              </li>
            ))}
        </ul>
      )}
    </div>
  );
}
