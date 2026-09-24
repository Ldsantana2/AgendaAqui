"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import HealthPlan from "./HealthPlan";

interface HealthPlanType {
  number?: string;
  validUntil?: string;
  planName?: string;
  situation?: string;
  accommodation?: string;
  isPrimary?: boolean;
  healthOperator?: {
    id: string;
    name: string;
  };
}

interface HealthPlanCarouselProps {
  healthPlans: HealthPlanType[];
  patientId?: string;
}

const HealthPlanCarousel: React.FC<HealthPlanCarouselProps> = ({
  healthPlans,
  patientId,
}) => {
  const router = useRouter();
  const initialIndex = Math.max(
    healthPlans.findIndex((plan) => plan.isPrimary),
    0,
  );
  const [index, setIndex] = useState(initialIndex);

  useEffect(() => {
    setIndex(initialIndex);
  }, [healthPlans.length, initialIndex]);

  const handleEdit = () => {
    router.push(`/profile_patient_edit${patientId ? `/${patientId}` : ""}`);
  };

  const currentPlan = healthPlans[index];

  return (
    <div className="bg-white border border-gray-200 rounded-lg min-h-[275px] flex flex-col justify-between relative p-6">
      {/* Botão de editar */}
      <button
        className="absolute top-4 right-4 text-base text-black hover:text-[#2D39A6] font-inter flex items-center"
        onClick={() =>
          router.push(
            `/profile_patient_edit${patientId ? `/${patientId}` : ""}`,
          )
        }
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 mr-1"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
          />
        </svg>
        Editar
      </button>

      <h2 className="text-lg font-semibold text-[#2D39A6] mb-4 text-center font-inter">
        Planos de Saúde
      </h2>

      {healthPlans.length === 0 ? (
        <p className="text-gray-500 font-inter text-center">
          Nenhum plano de saúde cadastrado.
        </p>
      ) : (
        <>
          <HealthPlan healthPlan={currentPlan} />

          <div className="flex justify-center items-center gap-10 mt-6">
            <button
              className={`rounded-full p-2 transition-colors ${
                index === 0
                  ? "text-gray-300 bg-gray-100 cursor-not-allowed"
                  : "text-[#2D39A6] hover:bg-blue-50"
              }`}
              onClick={() => index > 0 && setIndex(index - 1)}
              disabled={index === 0}
              title="Plano anterior"
            >
              <svg
                width="28"
                height="28"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                viewBox="0 0 24 24"
              >
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>
            <div className="text-sm text-gray-500 select-none font-inter">
              {index + 1} de {healthPlans.length}
            </div>
            <button
              className={`rounded-full p-2 transition-colors ${
                index === healthPlans.length - 1
                  ? "text-gray-300 bg-gray-100 cursor-not-allowed"
                  : "text-[#2D39A6] hover:bg-blue-50"
              }`}
              onClick={() =>
                index < healthPlans.length - 1 && setIndex(index + 1)
              }
              disabled={index === healthPlans.length - 1}
              title="Próximo plano"
            >
              <svg
                width="28"
                height="28"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                viewBox="0 0 24 24"
              >
                <polyline points="9 6 15 12 9 18"></polyline>
              </svg>
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default HealthPlanCarousel;
