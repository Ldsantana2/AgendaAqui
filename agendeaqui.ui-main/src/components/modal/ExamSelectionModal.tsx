"use client";

import React, { useState, useEffect } from "react";
import { Select, Form } from "antd";

type Item = {
  id: string;
  name: string;
};

type ExamSelectionModalProps = {
  examsList: Item[];
  selectedExams: string[]; // array de ids dos exames já vinculados
  onApply: (selectedIds: string[]) => void;
  onClose: () => void;
};

const ExamSelectionModal: React.FC<ExamSelectionModalProps> = ({
  examsList,
  selectedExams,
  onApply,
  onClose,
}) => {
  // Valor selecionado no dropdown (string ou undefined)
  const [currentSelection, setCurrentSelection] = useState<string | undefined>(
    undefined,
  );

  useEffect(() => {
    setCurrentSelection(undefined); // resetar seleção ao abrir modal
  }, [selectedExams]);

  const handleChange = (value: string) => {
    setCurrentSelection(value);
  };

  const options = examsList
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((exam) => ({
      value: exam.id,
      label: exam.name,
    }));

  const filterOption = (
    input: string,
    option?: { label: string; value: string },
  ) => {
    const normalize = (str: string) =>
      str
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();
    return normalize(option?.label ?? "").includes(normalize(input));
  };

  const handleApplyClick = () => {
    if (!currentSelection) {
      // Se não selecionou nada, só fecha
      onClose();
      return;
    }

    // Adiciona o exame selecionado ao array atual, sem duplicar
    const updatedSelection = selectedExams.includes(currentSelection)
      ? selectedExams
      : [...selectedExams, currentSelection];

    onApply(updatedSelection);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-lg relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-6 text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2D39A6] rounded"
          aria-label="Fechar modal"
        >
          &#10005;
        </button>

        <h2 id="modal-title" className="text-2xl font-bold text-gray-900 mb-6">
          Selecionar exame
        </h2>

        <Form layout="vertical">
          <Form.Item label="Exames">
            <Select
              showSearch
              value={currentSelection}
              onChange={handleChange}
              placeholder="Selecione exame"
              filterOption={filterOption}
              options={options}
              style={{ minHeight: 32 }}
            />
          </Form.Item>
        </Form>

        <div className="mt-8 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#2D39A6]"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={handleApplyClick}
            className="px-5 py-2 rounded-md bg-[#2D39A6] text-white hover:bg-[#283277] focus:outline-none focus:ring-2 focus:ring-[#2D39A6]"
          >
            Aplicar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExamSelectionModal;
