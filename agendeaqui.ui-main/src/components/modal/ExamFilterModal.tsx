"use client";
import React, { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";

interface Exam {
  id: string;
  name: string;
  type: string;
}

interface Props {
  exams: Exam[];
  selectedExams: string[];
  onChange: (selected: string[]) => void;
  onClose: () => void;
}

const ExamFilterModal: React.FC<Props> = ({
  exams,
  selectedExams,
  onChange,
  onClose,
}) => {
  const [selectedType, setSelectedType] = useState<string>("");
  const [filteredExams, setFilteredExams] = useState<Exam[]>([]);

  const types = Array.from(new Set(exams.map((e) => e.type)));

  useEffect(() => {
    if (selectedType) {
      setFilteredExams(exams.filter((exam) => exam.type === selectedType));
    } else {
      setFilteredExams([]);
    }
  }, [selectedType, exams]);

  const toggleExam = (id: string) => {
    if (selectedExams.includes(id)) {
      onChange(selectedExams.filter((e) => e !== id));
    } else {
      onChange([...selectedExams, id]);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-md relative">
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          <FaTimes />
        </button>
        <h2 className="text-lg font-semibold mb-4">Selecionar Exames</h2>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Tipo de exame
          </label>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value="">Selecione...</option>
            {types.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {selectedType && (
          <div className="max-h-52 overflow-y-auto border-t pt-2">
            {filteredExams.map((exam) => (
              <label
                key={exam.id}
                className="block text-sm py-1 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedExams.includes(exam.id)}
                  onChange={() => toggleExam(exam.id)}
                  className="mr-2"
                />
                {exam.name}
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExamFilterModal;
