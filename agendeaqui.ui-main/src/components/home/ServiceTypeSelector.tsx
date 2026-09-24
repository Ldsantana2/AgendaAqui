"use client";

import React from "react";
import { FaUserMd, FaFlask } from "react-icons/fa";

interface ServiceTypeSelectorProps {
  selectedType: string;
  setSelectedType: (type: string) => void;
}

export default function ServiceTypeSelector({ selectedType, setSelectedType }: ServiceTypeSelectorProps) {
  return (
    <div style={{ backgroundColor: "#2D39A6" }} className="shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-3">
        <div className="flex justify-start space-x-4">
          <button
            onClick={() => setSelectedType("consultas")}
            className={`flex items-center px-4 py-2 rounded-md transition-colors ${
              selectedType === "consultas"
                ? "text-white font-medium border border-white"
                : "text-white hover:opacity-80"
            }`}
            style={{ backgroundColor: selectedType === "consultas" ? "#2D39A6" : "transparent" }}
          >
            <FaUserMd className="mr-2" />
            Consultas
          </button>
          <button
            onClick={() => setSelectedType("exames")}
            className={`flex items-center px-4 py-2 rounded-md transition-colors ${
              selectedType === "exames"
                ? "text-white font-medium border border-white"
                : "text-white hover:opacity-80"
            }`}
            style={{ backgroundColor: selectedType === "exames" ? "#2D39A6" : "transparent" }}
          >
            <FaFlask className="mr-2" />
            Exames
          </button>
        </div>
      </div>
    </div>
  );
}
