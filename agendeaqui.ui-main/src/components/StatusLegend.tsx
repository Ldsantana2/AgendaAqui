import { FaClock, FaCheck, FaTimes, FaClipboard } from "react-icons/fa";
import React from "react";

export default function StatusLegend() {
  return (
    <div className="flex flex-wrap gap-4 mb-4">
      <div className="flex items-center">
        <div className="w-4 h-4 rounded bg-yellow-100 mr-2 flex items-center justify-center">
          <FaClock className="text-yellow-800 text-xs" />
        </div>
        <span className="text-sm">Agendado</span>
      </div>
      <div className="flex items-center">
        <div className="w-4 h-4 rounded bg-green-100 mr-2 flex items-center justify-center">
          <FaCheck className="text-green-800 text-xs" />
        </div>
        <span className="text-sm">Confirmado</span>
      </div>
      <div className="flex items-center">
        <div className="w-4 h-4 rounded bg-red-100 mr-2 flex items-center justify-center">
          <FaTimes className="text-red-800 text-xs" />
        </div>
        <span className="text-sm">Cancelado</span>
      </div>
      <div className="flex items-center">
        <div className="w-4 h-4 rounded bg-gray-100 mr-2 flex items-center justify-center">
          <FaClipboard className="text-gray-800 text-xs" />
        </div>
        <span className="text-sm">Realizado</span>
      </div>
    </div>
  );
}
