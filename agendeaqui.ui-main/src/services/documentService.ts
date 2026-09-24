import axios from "axios";
import { getToken } from "./authService";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_ROUTE;

// Buscar tipos de documentos (ex: Exame, Receita, Anamnese, etc.)
export const getDocumentTypes = async () => {
  const token = getToken();
  const res = await axios.get(`${BASE_URL}/document-types`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  // Espera array [{ id, name }]
  return res.data.data;
};

export const getDocumentSasUrl = async (docId) => {
  const token = getToken();
  const res = await axios.get(
    `${BASE_URL}/medical-documents/${docId}/sas-url`,
    { headers: { Authorization: `Bearer ${token}` } },
  );
  return res.data.url;
};

// Buscar documentos do paciente pelo patientId
export const getDocumentsByPatient = async (patientId: string) => {
  const token = getToken();
  const res = await axios.get(
    `${BASE_URL}/medical-documents?patientId=${patientId}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );
  // Espera array de documentos [{ id, fileName, type, url, uploadedAt, uploadedByRole, ... }]
  return res.data.data;
};

// Fazer upload de documento
export const uploadDocument = async (
  patientId: string,
  file: File,
  typeId: string,
  clinicId?: string, // Opcional, passe se quiser amarrar à clínica
) => {
  const token = getToken();
  const formData = new FormData();
  formData.append("file", file);
  formData.append("patientId", patientId);
  formData.append("typeId", typeId);
  if (clinicId) formData.append("clinicId", clinicId);

  const res = await axios.post(
    `${BASE_URL}/medical-documents/upload`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    },
  );
  return res.data.data;
};

// Renomear documento
export const renameDocument = async (docId: string, newName: string) => {
  const token = getToken();
  const res = await axios.patch(
    `${BASE_URL}/medical-documents/${docId}/rename`,
    { fileName: newName },
    { headers: { Authorization: `Bearer ${token}` } },
  );
  return res.data.data;
};

// Excluir documento
export const deleteDocument = async (docId: string) => {
  const token = getToken();
  const res = await axios.delete(`${BASE_URL}/medical-documents/${docId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.data;
};
