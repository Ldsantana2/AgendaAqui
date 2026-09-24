"use client";
import React from "react";
import { AiFillEnvironment } from "react-icons/ai";

interface LocationInfo {
  address: string;
  phone?: string;
  city?: string;
  mapLink?: string;
}

interface ClinicLocationProps {
  location: LocationInfo;
}

const ClinicViewLocation: React.FC<ClinicLocationProps> = ({ location }) => {
  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-lg font-semibold mb-4">Consultório</h2>
      <p className="text-sm text-gray-700 mb-2">
        <strong>Endereço:</strong> {location.address}, {location.city}
      </p>
      {location.phone && (
        <p className="text-sm text-gray-700 mb-2">
          <strong>Telefone:</strong> {location.phone}
        </p>
      )}
      {location.mapLink && (
        <button className="inline-flex items-center bg-gray-200 px-3 py-2 rounded text-sm text-gray-700 hover:bg-gray-300">
          <AiFillEnvironment className="mr-2" />
          Ampliar o mapa
        </button>
      )}
    </div>
  );
};

export default ClinicViewLocation;
