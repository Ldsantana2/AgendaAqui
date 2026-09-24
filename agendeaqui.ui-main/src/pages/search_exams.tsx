"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { FaFlask, FaCalendarAlt } from "react-icons/fa";
import {
  getAllExams,
  getClinicsByExamId,
  getExamTypes,
  getExamsByType,
} from "../services/examService";
import { useRouter } from "next/navigation";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import LoadingOverlay from "../components/LoadingOverlay";

// Chip de exame selecionado
function ExamChip({
  exam,
  onRemove,
}: {
  exam: any;
  onRemove: (id: string) => void;
}) {
  return (
    <span className="inline-flex items-center bg-[#e4e6f4] text-[#2D39A6] px-3 py-1 rounded-full mr-2 mb-2">
      {exam.name}
      <button
        className="ml-2 text-[#2D39A6] hover:text-[#1f264e] font-bold"
        onClick={() => onRemove(exam.id)}
        title="Remover exame"
      >
        ×
      </button>
    </span>
  );
}

export default function SearchExamsPage() {
  const searchParams = useSearchParams();
  const [exams, setExams] = useState<any[]>([]);
  const [examTypes, setExamTypes] = useState<any[]>([]);
  const [selectedExamType, setSelectedExamType] = useState<string>("");
  const [selectedExams, setSelectedExams] = useState<any[]>([]);
  const [clinics, setClinics] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const { user, token } = useAuth();

  useEffect(() => {
    async function fetchInitialData() {
      setLoading(true);
      try {
        const examTypesData = await getExamTypes();
        setExamTypes(examTypesData);

        const examTypeParam = searchParams.get("examType");
        if (examTypeParam) {
          setSelectedExamType(examTypeParam);
          const examsData = await getExamsByType(examTypeParam);
          setExams(examsData);
          if (examsData.length > 0) {
            await fetchClinicsForExams(examsData);
          }
        } else {
          const examsData = await getAllExams();
          setExams(examsData);

          const clinicMap = new Map();
          for (const exam of examsData) {
            const clinicsForExam = await getClinicsByExamId(exam.id);
            for (const clinic of clinicsForExam) {
              if (!clinicMap.has(clinic.id)) {
                clinicMap.set(clinic.id, { ...clinic, exams: [exam.name] });
              } else {
                clinicMap.set(clinic.id, {
                  ...clinicMap.get(clinic.id),
                  exams: [...clinicMap.get(clinic.id).exams, exam.name],
                });
              }
            }
          }
          setClinics(Array.from(clinicMap.values()));
        }
      } finally {
        setLoading(false);
      }
    }
    fetchInitialData();
  }, [searchParams]);

  const fetchClinicsForExams = async (examsData: any[]) => {
    const clinicMap = new Map();
    for (const exam of examsData) {
      const clinicsForExam = await getClinicsByExamId(exam.id);
      for (const clinic of clinicsForExam) {
        if (!clinicMap.has(clinic.id)) {
          clinicMap.set(clinic.id, { ...clinic, exams: [exam.name] });
        } else {
          clinicMap.set(clinic.id, {
            ...clinicMap.get(clinic.id),
            exams: [...clinicMap.get(clinic.id).exams, exam.name],
          });
        }
      }
    }
    setClinics(Array.from(clinicMap.values()));
  };

  const handleRemoveExam = (id: string) => {
    setSelectedExams(selectedExams.filter((e) => e.id !== id));
  };

  const handleSelectExam = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    if (!id) return;
    const alreadySelected = selectedExams.find((e) => e.id === id);
    if (alreadySelected) return;
    const exam = exams.find((e) => e.id === id);
    if (exam) setSelectedExams([...selectedExams, exam]);
  };

  const handleExamTypeChange = async (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const typeId = e.target.value;
    setSelectedExamType(typeId);
    setSelectedExams([]);

    if (typeId) {
      setLoading(true);
      try {
        const examsData = await getExamsByType(typeId);
        setExams(examsData);
        if (examsData.length > 0) {
          await fetchClinicsForExams(examsData);
        } else {
          setClinics([]);
        }
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(true);
      try {
        const examsData = await getAllExams();
        setExams(examsData);
        setClinics([]);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSearchClinics = async () => {
    setLoading(true);
    let allClinics: any[] = [];
    try {
      for (const exam of selectedExams) {
        const clinicsForExam = await getClinicsByExamId(exam.id);
        for (const clinic of clinicsForExam) {
          if (!allClinics.find((c) => c.id === clinic.id)) {
            allClinics.push({ ...clinic, exams: [exam.name] });
          } else {
            allClinics = allClinics.map((c) =>
              c.id === clinic.id ? { ...c, exams: [...c.exams, exam.name] } : c,
            );
          }
        }
      }
      setClinics(allClinics);
    } finally {
      setLoading(false);
    }
  };

  const handleScheduleClick = async (clinicId: string) => {
    if (!user || !user.email) {
      alert("Apenas pacientes logados podem realizar o agendamento!");
      return;
    }

    try {
      const response = await api.get("/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const userData = response.data.data;

      if (!userData || userData.role !== "PATIENT") {
        alert("Apenas pacientes logados podem realizar o agendamento!");
        return;
      }

      router.push(`/schedule_appointment_clinic?id=${clinicId}`);
    } catch (error) {
      alert("Erro ao verificar dados do usuário. Faça login novamente.");
    }
  };

  // Condição para mostrar o loading em tela cheia antes de renderizar a página
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col">
        <LoadingOverlay />
        <p className="mt-4 text-gray-600">Buscando exames e laboratórios...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 mt-8">
      <div className="flex flex-col md:flex-row gap-8 items-start">
        <div className="w-full md:w-1/2">
          <div className="bg-white rounded-lg shadow px-6 py-5">
            <div className="flex items-center gap-2 mb-6">
              <FaFlask className="text-[#2D39A6]" size={32} />
              <h2 className="text-2xl font-bold">
                Selecione os exames laboratoriais
              </h2>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de Exame
              </label>
              <select
                className="w-full border border-gray-300 rounded px-4 py-2"
                value={selectedExamType}
                onChange={handleExamTypeChange}
                disabled={loading}
              >
                <option value="">Todos os tipos de exame</option>
                {examTypes.map((type: any) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Exames
              </label>
              <select
                className="w-full border border-gray-300 rounded px-4 py-2"
                value=""
                onChange={handleSelectExam}
                disabled={loading || exams.length === 0}
              >
                <option value="">Selecione os exames</option>
                {exams.map((exam: any) => (
                  <option key={exam.id} value={exam.id}>
                    {exam.name}
                  </option>
                ))}
              </select>
              {exams.length === 0 && !loading && (
                <p className="text-sm text-gray-500 mt-1">
                  Nenhum exame disponível para o tipo selecionado
                </p>
              )}
            </div>

            {selectedExams.length > 0 && (
              <div className="mt-4">
                <div className="mb-2 font-medium text-gray-600">
                  Exames Selecionados:
                </div>
                <div>
                  {selectedExams.map((exam) => (
                    <ExamChip
                      key={exam.id}
                      exam={exam}
                      onRemove={handleRemoveExam}
                    />
                  ))}
                </div>
              </div>
            )}

            <button
              className="mt-6 flex items-center gap-2 bg-[#2D39A6] hover:bg-[#1f264e] text-white px-5 py-2 rounded transition"
              onClick={handleSearchClinics}
              disabled={selectedExams.length === 0 || loading}
            >
              <FaFlask />
              Buscar Exames
            </button>
          </div>
        </div>

        <div className="w-full md:w-1/2">
          <div className="bg-gray-50 rounded-lg shadow px-6 py-5">
            <h3 className="font-bold text-lg mb-3">Laboratórios disponíveis</h3>
            {clinics.length === 0 && !loading ? (
              <div className="text-gray-500">
                Nenhum laboratório encontrado.
              </div>
            ) : (
              clinics.map((clinic) => (
                <div
                  key={clinic.id}
                  className="bg-white rounded shadow p-4 mb-4"
                >
                  <div className="font-semibold">{clinic.name}</div>
                  <div className="text-gray-700 text-sm mb-2">
                    Exames oferecidos: {clinic.exams.join(", ")}
                  </div>
                  <button
                    className="flex items-center text-[#2D39A6] font-medium hover:underline text-sm"
                    onClick={() => handleScheduleClick(clinic.id)}
                  >
                    <FaCalendarAlt className="mr-1" /> Agendar
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
