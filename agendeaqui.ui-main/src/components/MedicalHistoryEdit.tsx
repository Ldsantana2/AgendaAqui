import React, { useState } from "react";

interface MedicalHistory {
  pastDiseases?: string;
  chronicDiseases?: string;
  seriousFamilyDiseases?: string;
  allergies?: string;
}

interface MedicalHistoryEditProps {
  medicalHistory: MedicalHistory;
  setMedicalHistory: React.Dispatch<React.SetStateAction<MedicalHistory>>;
}

export default function MedicalHistoryEdit({
  medicalHistory,
  setMedicalHistory,
}: MedicalHistoryEditProps) {
  // Estado local para edição temporária
  const [localHistory, setLocalHistory] =
    useState<MedicalHistory>(medicalHistory);

  const handleChange = (field: keyof MedicalHistory, value: string) => {
    setLocalHistory((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    setMedicalHistory(localHistory);
  };

  const handleCancel = () => {
    setLocalHistory(medicalHistory);
  };

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold text-[#2D39A6]">Histórico Médico</h2>
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Doenças Passadas */}
        <div className="flex flex-col">
          <label
            htmlFor="pastDiseases"
            className="mb-1 font-semibold text-gray-700"
          >
            Doenças Passadas
          </label>
          <textarea
            id="pastDiseases"
            className="border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[#2D39A6] resize-none h-24"
            placeholder="Descreva doenças passadas"
            value={localHistory.pastDiseases || ""}
            onChange={(e) => handleChange("pastDiseases", e.target.value)}
          />
        </div>

        {/* Doenças Crônicas */}
        <div className="flex flex-col">
          <label
            htmlFor="chronicDiseases"
            className="mb-1 font-semibold text-gray-700"
          >
            Doenças Crônicas
          </label>
          <textarea
            id="chronicDiseases"
            className="border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[#2D39A6] resize-none h-24"
            placeholder="Descreva doenças crônicas"
            value={localHistory.chronicDiseases || ""}
            onChange={(e) => handleChange("chronicDiseases", e.target.value)}
          />
        </div>

        {/* Doenças Graves na Família */}
        <div className="flex flex-col">
          <label
            htmlFor="seriousFamilyDiseases"
            className="mb-1 font-semibold text-gray-700"
          >
            Doenças Graves na Família
          </label>
          <textarea
            id="seriousFamilyDiseases"
            className="border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[#2D39A6] resize-none h-24"
            placeholder="Descreva doenças graves na família"
            value={localHistory.seriousFamilyDiseases || ""}
            onChange={(e) =>
              handleChange("seriousFamilyDiseases", e.target.value)
            }
          />
        </div>

        {/* Alergias */}
        <div className="flex flex-col">
          <label
            htmlFor="allergies"
            className="mb-1 font-semibold text-gray-700"
          >
            Alergias
          </label>
          <textarea
            id="allergies"
            className="border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[#2D39A6] resize-none h-24"
            placeholder="Descreva alergias"
            value={localHistory.allergies || ""}
            onChange={(e) => handleChange("allergies", e.target.value)}
          />
        </div>
      </div>

      {/* Botões fora da div principal */}
      <div className="flex justify-end gap-4 mt-4">
        <button
          type="button"
          onClick={handleCancel}
          className="px-4 py-2 border border-gray-400 rounded hover:bg-gray-100"
        >
          Descartar Alterações
        </button>
        <button
          type="button"
          onClick={handleSave}
          className="px-4 py-2 bg-[#2D39A6] text-white rounded hover:bg-[#283277]"
        >
          Salvar
        </button>
      </div>
    </section>
  );
}
