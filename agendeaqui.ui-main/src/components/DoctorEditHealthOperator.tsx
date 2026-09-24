"use client";

import { useEffect, useState, useCallback } from "react";
import { FaEdit, FaTimes } from "react-icons/fa";
import {
  assignOperatorToDoctor,
  removeOperatorFromDoctor,
  getOperatorsByDoctor,
} from "../services/doctorHealthOperatorService";
import { getHealthOperators } from "../services/healthOperatorService";
import { useMessage } from "../context/MessageContext";

interface DoctorEditHealthOperatorProps {
  doctorId: string;
  completionIndicator?: React.ReactNode;
  onUpdate?: () => void;
}

export default function DoctorEditHealthOperator({
  doctorId,
  completionIndicator,
  onUpdate,
}: DoctorEditHealthOperatorProps) {
  const [operators, setOperators] = useState<any[]>([]);
  const [allOperators, setAllOperators] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedOperatorId, setSelectedOperatorId] = useState<string>("");

  const messageApi = useMessage();

  // ⬇️ useCallback fixes the dependency warning!
  const fetchOperators = useCallback(async () => {
    try {
      const res = await getOperatorsByDoctor(doctorId);
      setOperators(Array.isArray(res) ? res : []);
    } catch {
      setOperators([]);
    }
  }, [doctorId]);

  const fetchAllOperators = async () => {
    try {
      const res = await getHealthOperators();
      setAllOperators(res);
    } catch {
      messageApi.error("Erro ao buscar operadoras disponíveis.");
    }
  };

  useEffect(() => {
    if (doctorId) {
      fetchOperators();
    }
  }, [doctorId, fetchOperators]); // ✅ Add fetchOperators to deps

  const handleAdd = async () => {
    if (!selectedOperatorId) return;
    try {
      await assignOperatorToDoctor(doctorId, selectedOperatorId);
      await fetchOperators();
      setSelectedOperatorId("");
      messageApi.success("Operadora adicionada com sucesso.");
      if (onUpdate) {
        onUpdate();
      }
    } catch (err: any) {
      messageApi.error(
        err.response?.data?.message || "Erro ao adicionar operadora.",
      );
    }
  };

  const handleRemove = async (operatorId: string) => {
    try {
      await removeOperatorFromDoctor(doctorId, operatorId);
      await fetchOperators();
      messageApi.success("Operadora removida com sucesso.");
      if (onUpdate) {
        onUpdate();
      }
    } catch {
      messageApi.error("Erro ao remover operadora.");
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setSelectedOperatorId("");
  };

  return (
    <div className="info-box p-4  rounded-md shadow-md bg-white relative">
      <div className="flex items-center mb-4">
        <h2 className="text-xl font-semibold text-[#2D39A6] mr-2">
          Operadoras de Saúde
        </h2>
        {completionIndicator}
      </div>

      {!isEditing ? (
        <button
          onClick={() => {
            setIsEditing(true);
            fetchAllOperators();
          }}
          className="absolute top-4 right-4 text-gray-600 hover:text-blue-600"
        >
          <FaEdit /> Editar
        </button>
      ) : (
        <div className="absolute top-4 right-4 flex space-x-2">
          <button
            onClick={handleCancel}
            className="text-red-600 hover:text-red-800"
          >
            <FaTimes /> Cancelar
          </button>
        </div>
      )}

      {!isEditing ? (
        <>
          {operators.length > 0 ? (
            <ul className="list-disc list-inside text-gray-800">
              {operators
                .filter((op) => op?.healthOperator)
                .map((op) => (
                  <li key={op.healthOperator.id}>
                    {op.healthOperator.operatorCompanyName}
                  </li>
                ))}
            </ul>
          ) : (
            <p>Nenhuma operadora cadastrada.</p>
          )}
        </>
      ) : (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <select
              value={selectedOperatorId}
              onChange={(e) => setSelectedOperatorId(e.target.value)}
              className="flex-1 max-w-xs border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-[#2D39A6]"
            >
              <option value="">Selecione uma operadora</option>
              {allOperators.map((op) => (
                <option key={op.id} value={op.id}>
                  {op.operatorCompanyName}
                </option>
              ))}
            </select>
            <button
              className="bg-[#2D39A6] hover:bg-[#283277] text-white px-3 py-1.5 rounded"
              onClick={handleAdd}
            >
              Adicionar
            </button>
          </div>

          <ul className="list-disc list-inside text-gray-800 mt-2">
            {operators
              .filter((op) => op?.healthOperator)
              .map((op) => (
                <li
                  key={op.healthOperator.id}
                  className="flex justify-between items-center"
                >
                  <span>{op.healthOperator.operatorCompanyName}</span>
                  <button
                    className="text-red-600 hover:underline text-sm"
                    onClick={() => handleRemove(op.healthOperator.id)}
                  >
                    Remover
                  </button>
                </li>
              ))}
          </ul>
        </div>
      )}
    </div>
  );
}
