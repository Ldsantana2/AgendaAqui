"use client";

import React, { useState, useEffect } from "react";
import { useMessage } from "../context/MessageContext";
import {
  getMyHealthPlans,
  createHealthPlan,
  deleteHealthPlan,
  setPrimaryHealthPlan,
} from "../services/healthplanService";
import { getHealthOperators } from "../services/healthOperatorService";
import { getHealthPlanTypesByOperator } from "../services/healthPlanTypeService";
import SectionCompletionIndicator from "./SectionCompletionIndicator";

interface HealthPlansEditProps {
  patientId: string;
}

const HealthPlansEdit: React.FC<HealthPlansEditProps> = ({ patientId }) => {
  const [healthPlans, setHealthPlans] = useState<any[]>([]);
  const [operators, setOperators] = useState<any[]>([]);
  const [planTypes, setPlanTypes] = useState<any[]>([]);
  const message = useMessage();

  const [form, setForm] = useState({
    number: "",
    validUntil: "",
    healthOperatorId: "",
    healthPlanTypeId: "",
  });

  useEffect(() => {
    const loadHealthPlanData = async () => {
      try {
        const myPlans = await getMyHealthPlans();
        setHealthPlans(myPlans || []);

        const allOperators = await getHealthOperators();
        setOperators(allOperators);
      } catch (err) {
        console.error("Erro ao carregar dados de planos de saúde:", err);
        message.error("Erro ao carregar planos de saúde.");
      }
    };
    if (patientId) {
      loadHealthPlanData();
    }
  }, [patientId, message]);

  useEffect(() => {
    const fetchPlanTypes = async () => {
      if (form.healthOperatorId) {
        try {
          const response = await getHealthPlanTypesByOperator(
            form.healthOperatorId,
          );
          const active = (response.data || []).filter(
            (p: any) => p.situation === "Ativo",
          );
          setPlanTypes(active);
        } catch {
          message.error("Erro ao buscar tipos de plano.");
        }
      } else {
        setPlanTypes([]);
      }
    };
    fetchPlanTypes();
  }, [form.healthOperatorId, message]);

  const handleAddPlan = async () => {
    try {
      const result = await createHealthPlan({
        patientId,
        healthOperatorId: form.healthOperatorId,
        healthPlanTypeId: form.healthPlanTypeId,
        number: form.number,
        validUntil: form.validUntil,
      });

      if (result.isSuccess) {
        const operator = operators.find(
          (op) => String(op.id) === String(form.healthOperatorId),
        );
        const planType = planTypes.find(
          (pt) => String(pt.id) === String(form.healthPlanTypeId),
        );

        const newPlan = {
          ...result.data,
          healthOperator: operator,
          planName: planType?.planName || "N/A",
        };

        setHealthPlans((prev) => [...prev, newPlan]);
        message.success("Plano adicionado.");
        setForm({
          number: "",
          validUntil: "",
          healthOperatorId: "",
          healthPlanTypeId: "",
        });
        setPlanTypes([]);
      } else {
        message.error(result.message || "Erro ao adicionar plano.");
      }
    } catch (error) {
      console.error(error);
      message.error("Erro ao adicionar plano.");
    }
  };

  const handleDeletePlan = async (planId: string) => {
    try {
      await deleteHealthPlan(planId);
      setHealthPlans((prev) => prev.filter((p) => p.id !== planId));
      message.success("Plano removido.");
    } catch {
      message.error("Erro ao remover plano.");
    }
  };

  const handleSetPrimary = async (planId: string) => {
    try {
      await setPrimaryHealthPlan(planId);
      setHealthPlans((prev) =>
        prev.map((p) => ({ ...p, isPrimary: p.id === planId })),
      );
      message.success("Plano definido como principal.");
    } catch {
      message.error("Erro ao definir plano principal.");
    }
  };

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-[#2D39A6]">
          Planos de Saúde
        </h2>
        <SectionCompletionIndicator
          title="Planos de Saúde"
          fields={
            healthPlans.length > 0
              ? [
                  {
                    name: "Plano(s) cadastrado(s)",
                    value: healthPlans.length.toString(),
                  },
                ]
              : []
          }
        />
      </div>

      <div className="bg-white p-8 rounded-lg shadow-md mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <select
            value={form.healthOperatorId}
            onChange={(e) =>
              setForm({
                ...form,
                healthOperatorId: e.target.value,
                healthPlanTypeId: "",
              })
            }
            className="p-2 border rounded w-full"
          >
            <option value="">Selecione uma operadora</option>
            {operators.map((op) => (
              <option key={op.id} value={op.id}>
                {op.operatorCompanyName}
              </option>
            ))}
          </select>

          <select
            value={form.healthPlanTypeId}
            onChange={(e) =>
              setForm({ ...form, healthPlanTypeId: e.target.value })
            }
            className="p-2 border rounded w-full pr-8"
            disabled={!form.healthOperatorId}
          >
            <option value="">Selecione o tipo de plano</option>
            {planTypes.map((pt) => (
              <option key={pt.id} value={pt.id}>
                {pt.planName}
              </option>
            ))}
          </select>

          <input
            value={form.number}
            onChange={(e) => setForm({ ...form, number: e.target.value })}
            placeholder="Número do plano"
            className="p-2 border rounded w-full"
          />
          <input
            type="date"
            value={form.validUntil}
            onChange={(e) => setForm({ ...form, validUntil: e.target.value })}
            className="p-2 border rounded w-full"
          />
        </div>

        <button
          onClick={handleAddPlan}
          className="px-4 py-2 bg-[#2D39A6] hover:bg-[#283277] text-white rounded"
          disabled={
            !form.healthOperatorId ||
            !form.healthPlanTypeId ||
            !form.number ||
            !form.validUntil
          }
        >
          Adicionar Plano
        </button>

        <hr className="my-6" />

        <ul className="space-y-4">
          {healthPlans.map((plan) => (
            <li
              key={plan.id}
              className="border p-4 rounded-md flex justify-between relative"
              style={{ minHeight: "140px" }}
            >
              <div>
                <p>
                  <strong>Operadora:</strong>{" "}
                  {plan.healthOperator?.operatorCompanyName || "N/A"}
                </p>
                <p>
                  <strong>Plano:</strong> {plan.planName || "N/A"}
                </p>
                <p>
                  <strong>Número:</strong> {plan.number}
                </p>
                <p>
                  <strong>Validade:</strong>{" "}
                  {new Date(plan.validUntil).toLocaleDateString()}
                </p>
              </div>

              <div className="relative w-32 flex flex-col items-end">
                {plan.isPrimary && (
                  <p className="text-green-600 font-bold absolute top-0 right-0 flex items-center gap-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                    Principal
                  </p>
                )}

                {!plan.isPrimary && (
                  <button
                    onClick={() => handleSetPrimary(plan.id)}
                    className="text-sm text-[#2D39A6]0 hover:text-[#283277] border border-[#2D39A6] rounded px-3 py-1 mb-2 mt-auto"
                  >
                    Definir como principal
                  </button>
                )}

                <button
                  onClick={() => handleDeletePlan(plan.id)}
                  className="p-2 rounded-full bg-red-50 hover:bg-red-100 absolute bottom-0 right-0"
                  title="Remover plano"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-red-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7h6m-1-3H10m-1 3h6"
                    />
                  </svg>
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default HealthPlansEdit;
