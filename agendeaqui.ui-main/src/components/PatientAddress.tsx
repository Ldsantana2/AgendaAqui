"use client";
import React from "react";
import { useRouter } from "next/navigation";

export interface AddressInfo {
  address?: string;
  number?: string;
  complement?: string;
  zipCode?: string;
  city?: string;
  state?: string;
}

interface PatientAddressProps {
  address?: string;
  addressInfo: AddressInfo;
  patientId?: string;
}

const PatientAddress: React.FC<PatientAddressProps> = ({
  addressInfo,
  patientId,
}) => {
  const router = useRouter();

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg w-full relative">
      {/* Botão de Editar Endereço  */}
      <button
        className="absolute top-4 right-4 text-base text-black hover:text-[#2D39A6] font-inter flex items-center"
        onClick={() =>
          router.push(
            `/profile_patient_edit${patientId ? `/${patientId}` : ""}`,
          )
        }
        title="Editar endereço"
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

      <div className="space-y-2">
        <p>
          <strong>CEP:</strong> {addressInfo.zipCode || "Não informado"}
        </p>
        <p>
          <strong>Endereço:</strong> {addressInfo.address || "Não informado"}
          {addressInfo.number && `, ${addressInfo.number}`}
        </p>
        <p>
          <strong>Complemento:</strong>{" "}
          {addressInfo.complement || "Não informado"}
        </p>
        <p>
          <strong>Cidade/Estado:</strong>{" "}
          {`${addressInfo.city || "Não informado"}${addressInfo.state ? ` - ${addressInfo.state}` : ""}`}
        </p>
      </div>
    </div>
  );
};

export default PatientAddress;
