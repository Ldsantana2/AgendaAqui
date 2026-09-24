import { useRouter } from "next/navigation";
import React from "react";

interface MedicationsProps {
  medications: {
    current?: string;
    past?: string;
  };
  patientId?: string;
  viewOnly?: boolean;
  onChange?: (field: string, value: string) => void;
}

const Medications: React.FC<MedicationsProps> = ({
  patientId,
  medications = {},
  viewOnly = true,

  onChange,
}) => {
  const router = useRouter();
  const { current, past } = medications;

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg w-full relative">
      <button
        className="absolute top-4 right-4 text-base text-black hover:text-[#283277] font-inter flex items-center"
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
      <div className="space-y-4">
        <div>
          <h3 className="text-md font-medium text-gray-700 mb-1">
            Medicamentos Atuais
          </h3>
          {viewOnly ? (
            <p>{current || "Não informado"}</p>
          ) : (
            <textarea
              value={current || ""}
              onChange={(e) => onChange && onChange("current", e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md"
              rows={3}
              placeholder="Informe os medicamentos que faz uso atualmente"
            />
          )}
        </div>

        <div>
          <h3 className="text-md font-medium text-gray-700 mb-1">
            Medicamentos Passados
          </h3>
          {viewOnly ? (
            <p>{past || "Não informado"}</p>
          ) : (
            <textarea
              value={past || ""}
              onChange={(e) => onChange && onChange("past", e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md"
              rows={3}
              placeholder="Informe os medicamentos usados no passado"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Medications;
