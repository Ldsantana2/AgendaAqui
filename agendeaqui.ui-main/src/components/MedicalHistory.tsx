import { useRouter } from "next/navigation";
import React from "react";

interface MedicalHistoryProps {
  medicalHistory: {
    pastDiseases?: string;
    chronicDiseases?: string;
    familyDiseases?: string;
    allergies?: string;
  };
  patientId?: string;
  viewOnly?: boolean;
  onChange?: (field: string, value: string) => void;
}

const MedicalHistory: React.FC<MedicalHistoryProps> = ({
  medicalHistory = {},
  patientId,
  viewOnly = true,
  onChange,
}) => {
  const router = useRouter();
  const { pastDiseases, chronicDiseases, familyDiseases, allergies } =
    medicalHistory;

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg w-full relative">
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
      <div className="space-y-4">
        <div>
          <h3 className="text-md font-medium text-gray-700 mb-1">
            Doenças Passadas
          </h3>
          {viewOnly ? (
            <p>{pastDiseases || "Não informado"}</p>
          ) : (
            <textarea
              value={pastDiseases || ""}
              onChange={(e) =>
                onChange && onChange("pastDiseases", e.target.value)
              }
              className="w-full p-3 border border-gray-300 rounded-md"
              rows={2}
              placeholder="Informe as doenças passadas"
            />
          )}
        </div>

        <div>
          <h3 className="text-md font-medium text-gray-700 mb-1">
            Doenças Crônicas
          </h3>
          {viewOnly ? (
            <p>{chronicDiseases || "Não informado"}</p>
          ) : (
            <textarea
              value={chronicDiseases || ""}
              onChange={(e) =>
                onChange && onChange("chronicDiseases", e.target.value)
              }
              className="w-full p-3 border border-gray-300 rounded-md"
              rows={2}
              placeholder="Informe as doenças crônicas"
            />
          )}
        </div>

        <div>
          <h3 className="text-md font-medium text-gray-700 mb-1">
            Doenças Graves na Família
          </h3>
          {viewOnly ? (
            <p>{familyDiseases || "Não informado"}</p>
          ) : (
            <textarea
              value={familyDiseases || ""}
              onChange={(e) =>
                onChange && onChange("familyDiseases", e.target.value)
              }
              className="w-full p-3 border border-gray-300 rounded-md"
              rows={2}
              placeholder="Informe as doenças graves na família"
            />
          )}
        </div>

        <div>
          <h3 className="text-md font-medium text-gray-700 mb-1">Alergias</h3>
          {viewOnly ? (
            <p>{allergies || "Não informado"}</p>
          ) : (
            <textarea
              value={allergies || ""}
              onChange={(e) =>
                onChange && onChange("allergies", e.target.value)
              }
              className="w-full p-3 border border-gray-300 rounded-md"
              rows={2}
              placeholder="Informe as alergias"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default MedicalHistory;
