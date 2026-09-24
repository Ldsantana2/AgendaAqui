"use client";

import { useEffect, useState, useCallback } from "react";
import {
  getMyHealthPlans,
  createHealthPlan,
  updateHealthPlan,
  deleteHealthPlan,
  setPrimaryHealthPlan,
} from "../services/healthplanService";
import { getHealthOperators } from "../services/healthOperatorService";
import { useMessage } from "../context/MessageContext";
import { getProfile } from "../services/authService";

interface HealthPlanForm {
  id?: string;
  number: string;
  validUntil: string;
  healthOperatorId: string;
  healthPlanTypeId: string;
}

export default function PatientHealthPlans() {
  const [plans, setPlans] = useState<any[]>([]);
  const [operators, setOperators] = useState<any[]>([]);
  const [form, setForm] = useState<HealthPlanForm>({
    number: "",
    validUntil: "",
    healthOperatorId: "",
    healthPlanTypeId: "",
  });
  const [editingPlanId, setEditingPlanId] = useState<string | null>(null);
  const message = useMessage();

  const fetchAll = useCallback(async () => {
    try {
      const [plansData, operatorsData] = await Promise.all([
        getMyHealthPlans(),
        getHealthOperators(),
      ]);
      setPlans(plansData);
      setOperators(operatorsData);
    } catch (err: any) {
      message.error("Erro ao carregar dados");
    }
  }, [message]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const profile = await getProfile();
      const patientId = profile.patient?.id;
      if (!patientId) throw new Error("Paciente não encontrado");

      if (editingPlanId) {
        await updateHealthPlan(editingPlanId, form);
        message.success("Plano atualizado com sucesso!");
      } else {
        await createHealthPlan({ ...form, patientId });
        message.success("Plano criado com sucesso!");
      }

      setForm({
        number: "",
        validUntil: "",
        healthOperatorId: "",
        healthPlanTypeId: "",
      });
      setEditingPlanId(null);
      fetchAll();
    } catch (err: any) {
      message.error("Erro ao salvar plano.");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteHealthPlan(id);
      message.success("Plano removido.");
      fetchAll();
    } catch {
      message.error("Erro ao remover plano.");
    }
  };

  const handlePrimary = async (id: string) => {
    try {
      await setPrimaryHealthPlan(id);
      message.success("Plano definido como primário.");
      fetchAll();
    } catch {
      message.error("Erro ao definir plano primário.");
    }
  };

  const handleEdit = (plan: any) => {
    setEditingPlanId(plan.id);
    setForm({
      number: plan.number,
      validUntil: plan.validUntil.split("T")[0],
      healthOperatorId: plan.healthOperatorId,
      healthPlanTypeId: plan.healthPlanTypeId,
    });
  };

  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold text-[#2D39A6] mb-4">
        Gerenciar Planos de Saúde
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <input
          name="number"
          value={form.number}
          onChange={handleChange}
          placeholder="Número do plano"
          className="p-2 border rounded w-full"
        />
        <input
          name="validUntil"
          type="date"
          value={form.validUntil}
          onChange={handleChange}
          className="p-2 border rounded w-full"
        />
        <select
          name="healthOperatorId"
          value={form.healthOperatorId}
          onChange={handleChange}
          className="p-2 border rounded w-full"
        >
          <option value="">Selecione a operadora</option>
          {operators.map((op) => (
            <option key={op.id} value={op.id}>
              {op.operatorCompanyName}
            </option>
          ))}
        </select>
        <select
          name="healthPlanTypeId"
          value={form.healthPlanTypeId}
          onChange={handleChange}
          className="p-2 border rounded w-full"
        >
          <option value="">Tipo de plano</option>
          {operators
            .find((op) => op.id === form.healthOperatorId)
            ?.healthPlanTypes?.map((type: any) => (
              <option key={type.id} value={type.id}>
                {type.planName}
              </option>
            ))}
        </select>
      </div>

      <button
        onClick={handleSave}
        className="bg-[#2D39A6] text-white px-4 py-2 rounded hover:bg-[#283277]"
      >
        {editingPlanId ? "Salvar Alterações" : "Adicionar Plano"}
      </button>

      <hr className="my-6" />

      <ul className="space-y-3">
        {plans.map((plan) => (
          <li
            key={plan.id}
            className="border p-4 rounded flex justify-between items-center"
          >
            <div>
              <p className="font-semibold">
                {plan.healthOperator?.operatorCompanyName} -{" "}
                {plan.planName || "Tipo desconhecido"}
              </p>
              <p className="text-sm text-gray-600">Nº: {plan.number}</p>
              <p className="text-sm text-gray-600">
                Validade: {new Date(plan.validUntil).toLocaleDateString()}
              </p>
              {plan.isPrimary && (
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded mt-1 inline-block">
                  Plano Primário
                </span>
              )}
            </div>
            <div className="flex gap-2">
              {!plan.isPrimary && (
                <button
                  onClick={() => handlePrimary(plan.id)}
                  className="text-sm text-blue-600 hover:underline"
                >
                  Tornar Primário
                </button>
              )}
              <button
                onClick={() => handleEdit(plan)}
                className="text-sm text-yellow-600 hover:underline"
              >
                Editar
              </button>
              <button
                onClick={() => handleDelete(plan.id)}
                className="text-sm text-red-600 hover:underline"
              >
                Remover
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
