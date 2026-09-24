import axios from "axios";
import type { ExamType } from "../entities/examType";

const base_url_api = process.env.NEXT_PUBLIC_BASE_ROUTE;

// Axios: Busca todos os exames
export const getAllExams = async () => {
  const res = await axios.get(`${base_url_api}/exam`);
  return res.data.data;
};

// Axios: Busca clínicas que oferecem determinado exame
export const getClinicsByExamId = async (examId: string) => {
  const res = await axios.get(
    `${base_url_api}/clinic-exam/clinics-by-exam/${examId}`,
  );
  return res.data.data;
};

// Fetch: Atualiza exames da clínica
export const updateClinicExams = async (
  clinicId: string,
  examIds: string[] | undefined,
): Promise<void> => {
  if (!examIds || examIds.length === 0) {
    console.log("Nenhum exame selecionado. Nenhuma atualização necessária.");
    return;
  }

  for (const examId of examIds) {
    const payload = { clinicId, examId };

    try {
      const response = await fetch(`${base_url_api}/clinic-exam`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(
          `Erro ao salvar o exame ${examId}: ${errorText || response.statusText}`,
        );
      } else {
        console.log(`Exame ${examId} salvo com sucesso.`);
      }
    } catch (error) {
      console.error(`Erro na requisição do exame ${examId}:`, error);
    }
  }

  console.log("Processamento dos exames finalizado.");
};

export const findAll = async (): Promise<{ id: string; name: string }[]> => {
  const response = await fetch(`${base_url_api}/exam`);

  if (!response.ok) {
    throw new Error("Erro ao buscar exames");
  }

  const data = await response.json();
  return data.data || [];
};

export const removeClinicExam = async (clinicId: string, examId: string) => {
  try {
    const response = await fetch(`${base_url_api}/clinic-exam`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ clinicId, examId }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || response.statusText);
    }

    console.log(`Exame ${examId} removido da clínica ${clinicId} com sucesso.`);
  } catch (error) {
    console.error(`Erro ao remover exame ${examId}:`, error);
    throw error;
  };
}

export const getExamTypes = async (): Promise<ExamType[]> => {
  try {
    const response = await fetch(`${base_url_api}/exam-type`);

    if (!response.ok) {
      throw new Error("Erro ao buscar tipos de exames");
    }

    const payload = await response.json();

    // Check if payload itself is the array we need
    if (Array.isArray(payload)) {
      return payload as ExamType[];
    }

    // Check if data exists and is an array
    if (payload.data && Array.isArray(payload.data)) {
      return payload.data as ExamType[];
    }

    // If we can't find the data, return an empty array
    return [] as ExamType[];
  } catch (error) {
    console.error("Erro ao carregar tipos de exames:", (error as Error).message);
    throw error;
  }
};

export const getExamsByType = async (typeId: string): Promise<{ id: string; name: string; type: string }[]> => {
  try {
    // Busca todos os exames
    const allExams = await getAllExams();

    // Filtra os exames pelo tipo
    return allExams.filter(exam => exam.examTypeId === typeId);
  } catch (error) {
    console.error("Erro ao buscar exames por tipo:", error);
    throw new Error("Erro ao buscar exames por tipo");
  }
};

export const getClinicExams = async (clinicId: string): Promise<{ id: string; name: string }[]> => {
  try {
    const response = await fetch(`${base_url_api}/clinic-exam/clinic/${clinicId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Falha ao carregar exames da clínica");
    }

    const data = await response.json();
    return (data.data || []).map((item: any) => ({
      id: item.exam.id,
      name: item.exam.name,
    }));
  } catch (error) {
    console.error("Erro ao buscar exames da clínica:", (error as Error).message);
    throw error;
  }
};

// All functions are already exported individually at their declaration points
