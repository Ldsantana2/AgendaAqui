const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://agendeaqui-api-auth.onrender.com/api";

// Convert to named exports
export async function findClinicsByExam(examId: string) {
  const response = await fetch(`${API_BASE_URL}/clinic-exam/clinics-by-exam/${examId}`);
  if (!response.ok) throw new Error("Erro ao buscar clínicas para o exame");
  const result = await response.json();
  return result.data;
}

export async function findClinicsByExams(examIds: string[]) {
  const response = await fetch(`${API_BASE_URL}/clinic-exam/clinics-by-exams`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ examIds }),
  });

  if (!response.ok) throw new Error("Erro ao buscar clínicas para múltiplos exames");
  const result = await response.json();
  return result.data;
}
