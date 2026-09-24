import React from "react";

const AppointmentHistory: React.FC = () => {
  return (
    <div className="p-8 bg-white rounded-lg shadow-lg w-full">
      <h2 className="text-2xl font-semibold text-[#2D39A6] mb-4">
        Histórico de Consultas
      </h2>
      <p className="text-gray-500 italic">Nenhuma consulta registrada.</p>
    </div>
  );
};

export default AppointmentHistory;
