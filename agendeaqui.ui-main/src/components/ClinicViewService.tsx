"use client";
import React, { useState } from "react";
import { ClinicService } from "../entities/ClinicService";
import { ServiceCategory } from "../entities/serviceCategory";

interface ClinicServicesProps {
  services: ClinicService[];
  serviceCategories: ServiceCategory[];
  onShowMoreServices?: () => void;
}

const ClinicServices: React.FC<ClinicServicesProps> = ({
  services,
  serviceCategories,
  onShowMoreServices,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  // Filtra serviços conforme seleção de categoria
  const filteredServices = selectedCategory
    ? services.filter(
        (service) => service.serviceCategory.id === selectedCategory,
      )
    : services;

  return (
    <>
      <h2 style={{
        fontFamily: "Inter",
        fontWeight: 400,
        fontSize: "20px",
        lineHeight: "100%",
        letterSpacing: "0%",
        color: "#000000",
        marginBottom: "8px",
        marginTop: "0px"
      }}>Serviços</h2>
      <div className="mb-2">
        <select
          className="border border-gray-300 p-2 rounded w-full mb-2"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">Todas as categorias</option>
          {serviceCategories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {filteredServices.length === 0 ? (
        <div className="text-gray-500">
          Nenhum serviço cadastrado para essa categoria.
        </div>
      ) : (
        filteredServices.map((service) => (
          <div
            key={service.id}
            className="mb-3 border-b pb-3 last:border-none last:pb-0"
          >
            <p className="text-gray-800 font-light">
              {service.customName} - R$ {service.price}
            </p>
          </div>
        ))
      )}
    </>
  );
};

export default ClinicServices;
