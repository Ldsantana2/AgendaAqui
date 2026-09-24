import React, { useEffect, useState } from "react";
import {
  FaFileMedical,
  FaFilePrescription,
  FaClipboardList,
  FaFileAlt,
  FaTrash,
  FaEdit,
  FaDownload,
  FaUserMd,
  FaUser,
  FaPlus,
  FaFilter,
} from "react-icons/fa";
import { getToken, getProfile } from "../../../services/authService";
import {
  getDocumentTypes,
  getDocumentsByPatient,
  uploadDocument,
  renameDocument,
  deleteDocument,
  getDocumentSasUrl,
} from "../../../services/documentService";
import Modal from "../../../components/modal/PatientDocumentsModal";
import { useMessage } from "../../../context/MessageContext";
import { Modal as AntdModal } from "antd";

const documentTypeIcons = {
  Exame: <FaFileMedical className="text-[#283277]" />,
  Receita: <FaFilePrescription className="text-[#283277]" />,
  Laudo: <FaFileAlt className="text-[#283277]" />,
  "Solicitação de Exames": <FaClipboardList className="text-[#283277]" />,
  Atestado: <FaFileAlt className="text-[#283277]" />,
  Prescrição: <FaFilePrescription className="text-[#283277]" />,
  Anamnese: <FaFileAlt className="text-[#283277]" />,
  Outro: <FaFileAlt className="text-[#283277]" />,
};

export default function MedicalDocumentsPage() {
  const [documents, setDocuments] = useState<any[]>([]);
  const [documentTypes, setDocumentTypes] = useState<any[]>([]);
  const [selectedType, setSelectedType] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editDoc, setEditDoc] = useState<any>(null);
  const [newName, setNewName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploadTypeId, setUploadTypeId] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const [profile, setProfile] = useState<any>(null);

  const message = useMessage();

  useEffect(() => {
    (async () => {
      try {
        const prof = await getProfile();
        setProfile(prof);
        const types = await getDocumentTypes();
        setDocumentTypes(types);
        const docs = await getDocumentsByPatient(prof.patient?.id);
        setDocuments(docs);
      } catch (err) {
        message.error("Erro ao carregar documentos.");
      }
    })();
  }, []);

  const filteredDocs = selectedType
    ? documents.filter((doc) => doc.type?.name === selectedType)
    : documents;

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !uploadTypeId) return;
    setUploading(true);
    try {
      await uploadDocument(profile.patient.id, file, uploadTypeId);
      const docs = await getDocumentsByPatient(profile.patient?.id);
      setDocuments(docs);
      setFile(null);
      setUploadTypeId("");
      setShowModal(false);
      message.success("Documento anexado com sucesso!");
    } catch (e) {
      message.error("Erro ao anexar documento.");
    } finally {
      setUploading(false);
    }
  };

  const handleRename = async (docId: string) => {
    try {
      if (!newName) return;
      await renameDocument(docId, newName);
      const docs = await getDocumentsByPatient(profile.patient?.id);
      setDocuments(docs);
      setEditDoc(null);
      setNewName("");
      message.success("Documento renomeado com sucesso!");
    } catch (e) {
      message.error("Erro ao renomear documento.");
    }
  };

  const handleDelete = async (docId: string) => {
    AntdModal.confirm({
      title: "Confirma exclusão?",
      content: "Tem certeza que deseja excluir este documento?",
      okText: "Sim",
      cancelText: "Não",
      onOk: async () => {
        try {
          await deleteDocument(docId);
          setDocuments((docs) => docs.filter((doc) => doc.id !== docId));
          message.success("Documento excluído com sucesso!");
        } catch (e) {
          message.error("Erro ao excluir documento.");
        }
      },
    });
  };

  const handleDownload = async (docId) => {
    const sasUrl = await getDocumentSasUrl(docId);
    window.open(sasUrl, "_blank");
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-[#283277]">
          Documentos Médicos
        </h1>
        <button
          className="flex items-center bg-[#283277] text-white px-4 py-2 rounded hover:bg-[#1f265e]"
          onClick={() => setShowModal(true)}
        >
          <FaPlus className="mr-2" /> Anexar Documento
        </button>
      </div>
      <div className="mb-4 flex gap-2">
        <select
          className="border rounded px-3 py-2"
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
        >
          <option value="">Todos os tipos</option>
          {documentTypes.map((type) => (
            <option key={type.id} value={type.name}>
              {type.name}
            </option>
          ))}
        </select>
        <FaFilter className="text-gray-400 mt-3" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredDocs
          .sort(
            (a, b) =>
              new Date(b.uploadedAt).getTime() -
              new Date(a.uploadedAt).getTime(),
          )
          .map((doc) => (
            <div
              key={doc.id}
              className="bg-white rounded-lg shadow p-4 flex flex-col gap-2 border-l-4"
              style={{ borderColor: "#283277" }}
            >
              <div className="flex items-center gap-2">
                {documentTypeIcons[doc.type?.name] ||
                  documentTypeIcons["Outro"]}
                <span className="font-semibold">{doc.fileName}</span>
                <span className="ml-auto text-xs text-gray-500">
                  {doc.type?.name}
                </span>
              </div>
              <div className="flex flex-wrap gap-2 items-center text-sm text-gray-600">
                <span>
                  {doc.clinicId ? (
                    <>
                      <FaUserMd className="inline mr-1" />
                      Clínica
                    </>
                  ) : (
                    <>
                      <FaUser className="inline mr-1" />
                      Paciente
                    </>
                  )}
                </span>
                <span>{new Date(doc.uploadedAt).toLocaleString("pt-BR")}</span>
              </div>
              <div className="flex gap-2 mt-2">
                <button
                  className="text-[#283277] hover:underline flex items-center"
                  onClick={() => handleDownload(doc.id)}
                >
                  <FaDownload className="mr-1" /> Download
                </button>
                <button
                  className="text-yellow-600 hover:underline flex items-center"
                  onClick={() => {
                    setEditDoc(doc);
                    setNewName(doc.fileName);
                  }}
                >
                  <FaEdit className="mr-1" /> Renomear
                </button>
                <button
                  className="text-red-600 hover:underline flex items-center"
                  onClick={() => handleDelete(doc.id)}
                >
                  <FaTrash className="mr-1" /> Excluir
                </button>
              </div>
            </div>
          ))}
      </div>

      {showModal && (
        <Modal onClose={() => setShowModal(false)}>
          <form onSubmit={handleUpload} className="flex flex-col gap-4">
            <h2 className="text-xl font-semibold mb-2">Anexar Documento</h2>
            <select
              required
              className="border rounded px-3 py-2"
              value={uploadTypeId}
              onChange={(e) => setUploadTypeId(e.target.value)}
            >
              <option value="">Selecione o tipo</option>
              {documentTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              required
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="border rounded px-3 py-2"
            />
            <button
              type="submit"
              className="bg-[#283277] text-white px-4 py-2 rounded hover:bg-[#1f265e]"
              disabled={uploading}
            >
              {uploading ? "Anexando..." : "Anexar"}
            </button>
          </form>
        </Modal>
      )}

      {editDoc && (
        <Modal onClose={() => setEditDoc(null)}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleRename(editDoc.id);
            }}
          >
            <h2 className="text-lg font-semibold mb-2">Renomear Documento</h2>
            <input
              type="text"
              className="border rounded px-3 py-2 mb-4 w-full"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              required
            />
            <button
              type="submit"
              className="bg-[#283277] text-white px-4 py-2 rounded hover:bg-[#1f265e]"
            >
              Salvar
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
}
