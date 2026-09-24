"use client";

import React from "react";

type HealthPlanProps = {
  healthPlan: {
    number?: string;
    validUntil?: string;
    planName?: string;
    situation?: string;
    accommodation?: string;
    healthOperator?: {
      id: string;
      name: string;
    };
  } | null;
};

const HealthPlan: React.FC<HealthPlanProps> = ({ healthPlan }) => {
  if (!healthPlan) {
    return (
      <div className="relative p-8 bg-white rounded-lg shadow-lg w-full">
        <h2 className="text-2xl font-semibold text-[#2D39A6] mb-6">
          Plano de Saúde
        </h2>
        <p className="text-gray-700">Nenhum plano de saúde cadastrado.</p>
      </div>
    );
  }

  return (
    <div className="relative p-8 bg-white rounded-lg shadow-lg w-full">
      <h2 className="text-2xl font-semibold text-[#2D39A6] mb-6">
        Plano de Saúde
      </h2>
      <div className="space-y-2">
        <p className="text-gray-700">
          <strong>Operadora:</strong>{" "}
          {healthPlan.healthOperator?.name || "Não informado"}
        </p>
        <p className="text-gray-700">
          <strong>Nome do Plano:</strong>{" "}
          {healthPlan.planName || "Não informado"}
        </p>
        <p className="text-gray-700">
          <strong>Acomodação:</strong>{" "}
          {healthPlan.accommodation || "Não informado"}
        </p>
        <p className="text-gray-700">
          <strong>Situação:</strong> {healthPlan.situation || "Não informado"}
        </p>
        <p className="text-gray-700">
          <strong>Número do Plano:</strong>{" "}
          {healthPlan.number || "Não informado"}
        </p>
        <p className="text-gray-700">
          <strong>Validade:</strong>{" "}
          {healthPlan.validUntil
            ? new Date(healthPlan.validUntil).toLocaleDateString()
            : "Não informado"}
        </p>
      </div>
    </div>
  );
};

export default HealthPlan;
