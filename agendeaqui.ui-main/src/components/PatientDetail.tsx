import React from "react";
import Image from "next/image";

interface PatientHistory {
  id: string;
  patientId: string;
  patientName: string;
  photo: string;
  age: number;
  address: string;
  lastAppointment: string;
  totalAppointments: number;
  contactInfo: { phone: string; email: string };
  hasAnamnesis: boolean;
  hasExams: boolean;
  hasRequests: boolean;
  anamnesisData?: string;
}

const PatientDetail: React.FC<{
  patient: PatientHistory;
  onClose: () => void;
}> = ({ patient, onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl my-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-[#2D39A6]">Ficha do Paciente</h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 text-2xl"
        >
          &times;
        </button>
      </div>
      <div className="flex flex-col md:flex-row gap-6 mb-6">
        <div className="flex flex-col items-center">
          <Image
            src={patient.photo}
            alt={patient.patientName}
            width={160}
            height={160}
            className="rounded-full object-cover border-4 border-[#2D39A6]"
            style={{ width: "160px", height: "160px" }}
          />
          <h3 className="text-xl font-semibold mt-3 text-center">
            {patient.patientName}
          </h3>
          <p className="text-gray-600">{patient.age} anos</p>
        </div>
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 p-4 rounded shadow-sm">
            <h3 className="font-semibold text-lg mb-2 text-[#2D39A6]">
              Informações de Contato
            </h3>
            <p className="flex items-center">
              <span className="inline-block w-5 mr-2 text-center text-[#2D39A6]">
                📱
              </span>{" "}
              {patient.contactInfo.phone}
            </p>
            <p className="mt-2 flex items-center">
              <span className="inline-block w-5 mr-2 text-center text-[#2D39A6]">
                @
              </span>{" "}
              {patient.contactInfo.email}
            </p>
            <p className="mt-2 flex items-start">
              <span className="inline-block w-5 mr-2 text-center text-[#2D39A6] mt-1">
                🏠
              </span>{" "}
              {patient.address}
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded shadow-sm">
            <h3 className="font-semibold text-lg mb-2 text-[#2D39A6]">
              Histórico de Consultas
            </h3>
            <p>
              Última consulta:{" "}
              <span className="font-medium">
                {new Date(patient.lastAppointment).toLocaleDateString("pt-BR")}
              </span>
            </p>
            <p className="mt-2">
              Total de consultas:{" "}
              <span className="font-medium">{patient.totalAppointments}</span>
            </p>
          </div>
        </div>
      </div>
      <div className="flex justify-end space-x-4 pt-4 border-t">
        <button
          onClick={onClose}
          className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded transition-colors"
        >
          Fechar
        </button>
      </div>
    </div>
  </div>
);

export default PatientDetail;
