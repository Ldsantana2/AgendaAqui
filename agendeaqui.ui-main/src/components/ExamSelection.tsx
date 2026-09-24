"use client";

import { useState, useEffect } from "react";
import { FaFlask } from "react-icons/fa";
import { getAllExams } from "../services/examService"; // Função para buscar todos os exames

export default function ExamSelectionCard() {
  const [exams, setExams] = useState<any[]>([]);
  const [selectedExams, setSelectedExams] = useState<any[]>([]);

  // Função para buscar todos os exames disponíveis
  useEffect(() => {
    const fetchExams = async () => {
      try {
        const examData = await getAllExams(); // Recupera todos os exames
        setExams(examData);
      } catch (error) {
        console.error("Erro ao carregar exames", error);
      }
    };
    fetchExams();
  }, []);

  // Função para gerenciar a seleção de exames
  const handleSelectExam = (exam: any) => {
    if (selectedExams.includes(exam)) {
      setSelectedExams(selectedExams.filter((e) => e.id !== exam.id)); // Remove o exame
    } else {
      setSelectedExams([...selectedExams, exam]); // Adiciona o exame
    }
  };

  // Função que simula a busca de clínicas para os exames selecionados
  const handleSearchClinics = () => {
    if (selectedExams.length > 0) {
      console.log("Exames selecionados:", selectedExams);
      // Aqui seria feita a chamada para o backend
      alert(
        `Buscando clínicas para os exames selecionados: ${selectedExams.map((e) => e.name).join(", ")}`,
      );
    } else {
      alert("Selecione ao menos um exame!");
    }
  };

  return (
    <div className="border p-4 rounded-lg shadow-sm">
      <div className="flex items-center space-x-2">
        <FaFlask size={24} className="text-[#2D39A6]" />
        <h3 className="text-xl font-semibold">Selecione os Exames</h3>
      </div>
      <div className="mt-4">
        <select
          multiple
          value={selectedExams.map((exam) => exam.id)}
          onChange={(e) => {
            const selectedIds = Array.from(
              e.target.selectedOptions,
              (option) => option.value,
            );
            setSelectedExams(
              exams.filter((exam) => selectedIds.includes(exam.id)),
            );
          }}
          className="w-full p-2 border border-gray-300 rounded-md"
        >
          {exams.map((exam) => (
            <option key={exam.id} value={exam.id}>
              {exam.name}
            </option>
          ))}
        </select>
      </div>
      <div className="mt-4">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          onClick={handleSearchClinics}
        >
          Buscar Clínicas
        </button>
      </div>
    </div>
  );
}
