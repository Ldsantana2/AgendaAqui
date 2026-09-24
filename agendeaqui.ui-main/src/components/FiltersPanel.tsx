// components/FiltersPanel.tsx
import React, { useEffect } from "react";

type HealthOperator = {
  id: string;
  operatorCompanyName?: string;
  name?: string;
};

type Service = {
  id: string;
  customName?: string;
  category?: string;
  price?: number;
};

type Doctor = {
  id: string;
  name: string;
  surname: string;
  specialties?: { id: string; name: string }[];
};

type Props = {
  healthOperators: HealthOperator[];
  selectedHealthOperator: string;
  onHealthOperatorChange: (v: string) => void;
  services: Service[];
  selectedService: string;
  onServiceChange: (v: string) => void;
  allSpecialties: { id: string; name: string }[];
  selectedSpecialty: string;
  onSpecialtyChange: (v: string) => void;
  doctors: Doctor[];
  selectedDoctorId: string | null;
  onDoctorChange: (v: string) => void;
};

export default function FiltersPanel({
  healthOperators,
  selectedHealthOperator,
  onHealthOperatorChange,
  services,
  selectedService,
  onServiceChange,
  allSpecialties,
  selectedSpecialty,
  onSpecialtyChange,
  doctors,
  selectedDoctorId,
  onDoctorChange,
}: Props) {
  // pré-seleciona a primeira operadora assim que o array for carregado
  useEffect(() => {
    if (!selectedHealthOperator && healthOperators.length > 0) {
      onHealthOperatorChange(healthOperators[0].id);
    }
  }, [healthOperators, selectedHealthOperator, onHealthOperatorChange]);

  return (
    <div className="flex flex-col gap-4">
      {/* Operadora */}
      <div className="bg-white rounded shadow p-4">
        <h2 className="text-lg font-semibold mb-2">Operadora de Saúde</h2>
        <select
          className="border px-2 py-1 rounded text-sm w-full"
          value={selectedHealthOperator}
          onChange={(e) => onHealthOperatorChange(e.target.value)}
        >
          {healthOperators.map((op) => (
            <option key={op.id} value={op.id}>
              {op.operatorCompanyName || op.name}
            </option>
          ))}
        </select>
      </div>

      {/* Serviços */}
      <div className="bg-white rounded shadow p-4">
        <h2 className="text-lg font-semibold mb-2">Serviços Disponíveis</h2>
        <select
          className="border px-2 py-1 rounded text-sm w-full"
          value={selectedService}
          onChange={(e) => onServiceChange(e.target.value)}
        >
          <option value="">Selecione um serviço</option>
          {services.map((s) => (
            <option key={s.id} value={s.id}>
              {s.customName || s.category} — R$ {s.price}
            </option>
          ))}
        </select>
      </div>

      {/* Especialidades */}
      <div className="bg-white rounded shadow p-4">
        <h2 className="text-lg font-semibold mb-2">Especialidades</h2>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onSpecialtyChange("")}
            className={`px-3 py-1 border rounded ${
              selectedSpecialty === ""
                ? "bg-[#2D39A6] text-white"
                : "bg-white text-gray-700"
            }`}
          >
            Todas
          </button>
          {allSpecialties.map((spec) => (
            <button
              key={spec.id}
              onClick={() => onSpecialtyChange(spec.id)}
              className={`px-3 py-1 border rounded ${
                selectedSpecialty === spec.id
                  ? "bg-[#2D39A6] text-white"
                  : "bg-white text-gray-700"
              }`}
            >
              {spec.name}
            </button>
          ))}
        </div>
      </div>

      {/* Médicos */}
      <div className="bg-white rounded shadow p-4">
        <h2 className="text-lg font-semibold mb-2">Médico</h2>
        <select
          className="border px-2 py-1 rounded text-sm w-full"
          value={selectedDoctorId || ""}
          onChange={(e) => onDoctorChange(e.target.value)}
        >
          <option value="">Selecione um Médico</option>
          {doctors.map((doc) => (
            <option key={doc.id} value={doc.id}>
              Dr(a). {doc.name} {doc.surname}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
