import React, { useEffect, useState } from "react";

interface MedicationsData {
  currentMedications?: string;
  pastMedications?: string;
}

interface MedicationsProps {
  medications: MedicationsData;
  setMedications: (value: MedicationsData) => void;
  onSave: (data: MedicationsData) => void;
  onCancel: () => void;
}

export default function Medications({
  medications,
  setMedications,
  onSave,
  onCancel,
}: MedicationsProps) {
  const [localMedications, setLocalMedications] = useState<MedicationsData>({
    currentMedications: medications.currentMedications || "",
    pastMedications: medications.pastMedications || "",
  });

  useEffect(() => {
    setLocalMedications({
      currentMedications: medications.currentMedications || "",
      pastMedications: medications.pastMedications || "",
    });
  }, [medications]);

  const handleChange = (field: keyof MedicationsData, value: string) => {
    setLocalMedications((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold text-[#2D39A6]">Medicamentos</h2>

      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Medicamentos Atuais */}
        <div className="flex flex-col">
          <label
            htmlFor="currentMedications"
            className="mb-1 font-semibold text-gray-700"
          >
            Medicamentos Atuais
          </label>
          <textarea
            id="currentMedications"
            className="border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[#2D39A6] resize-none h-24"
            placeholder="Liste seus medicamentos atuais"
            value={localMedications.currentMedications}
            onChange={(e) => handleChange("currentMedications", e.target.value)}
          />
        </div>

        {/* Medicamentos Passados */}
        <div className="flex flex-col">
          <label
            htmlFor="pastMedications"
            className="mb-1 font-semibold text-gray-700"
          >
            Medicamentos Passados
          </label>
          <textarea
            id="pastMedications"
            className="border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[#2D39A6] resize-none h-24"
            placeholder="Liste seus medicamentos passados"
            value={localMedications.pastMedications}
            onChange={(e) => handleChange("pastMedications", e.target.value)}
          />
        </div>
      </div>

      {/* Botões fora da div principal */}
      <div className="flex justify-end gap-4 mt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-400 rounded hover:bg-gray-100"
        >
          Descartar Alterações
        </button>
        <button
          type="button"
          onClick={() => onSave(localMedications)}
          className="px-4 py-2 bg-[#2D39A6] text-white rounded hover:bg-[#283277]"
        >
          Salvar
        </button>
      </div>
    </section>
  );
}
