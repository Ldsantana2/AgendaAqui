"use client";

import React, { useState, useEffect, Dispatch, SetStateAction } from "react";
import { FaEdit, FaSave, FaTimes, FaSearch } from "react-icons/fa";

async function buscarEnderecoPorCep(cep: string) {
  const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
  const data = await response.json();
  if (data.erro) throw new Error("CEP inválido");
  return {
    rua: data.logradouro,
    bairro: data.bairro,
    cidade: data.localidade,
    estado: data.uf,
  };
}

export interface Location {
  address: string;
  city: string;
  state: string;
  cep?: string;
  number?: string;
  bairro?: string;
}

interface ClinicEditLocationProps {
  locations: Location[];
  onSave: (updatedLocations: Location[]) => void;
  isEditingExternally?: boolean;
  onEditStateChange?: Dispatch<SetStateAction<boolean>>;
}

const ClinicEditLocation: React.FC<ClinicEditLocationProps> = ({
  locations,
  onSave,
  isEditingExternally,
  onEditStateChange,
}) => {
  const [isEditing, setIsEditing] = useState(isEditingExternally || false);
  const [editedLocations, setEditedLocations] = useState<Location[]>([
    ...locations,
  ]);
  const [originalLocations, setOriginalLocations] = useState<Location[]>([
    ...locations,
  ]);
  const [cepError, setCepError] = useState<string | null>(null);
  const [isLoadingCep, setIsLoadingCep] = useState(false);

  useEffect(() => {
    setIsEditing(isEditingExternally || false);

    if (!isEditingExternally) {
      setEditedLocations([...originalLocations]);
    }
  }, [isEditingExternally, originalLocations]);

  useEffect(() => {
    setEditedLocations([...locations]);
    setOriginalLocations([...locations]);
  }, [locations]);

  const handleChange = (
    index: number,
    field: keyof Location,
    value: string,
  ) => {
    const updatedLocations = [...editedLocations];
    updatedLocations[index] = { ...updatedLocations[index], [field]: value };
    setEditedLocations(updatedLocations);
  };

  const handleCepSearch = async (index: number) => {
    const cep = editedLocations[index].cep;
    if (!cep || cep.length !== 8) {
      setCepError("CEP deve ter 8 dígitos");
      return;
    }

    setIsLoadingCep(true);
    setCepError(null);

    try {
      const endereco = await buscarEnderecoPorCep(cep);
      const updatedLocations = [...editedLocations];
      updatedLocations[index] = {
        ...updatedLocations[index],
        address: endereco.rua,
        city: endereco.cidade,
        state: endereco.estado,
        bairro: endereco.bairro,
      };
      setEditedLocations(updatedLocations);
    } catch (error) {
      setCepError("CEP inválido ou não encontrado");
    } finally {
      setIsLoadingCep(false);
    }
  };

  const handleSave = () => {
    onSave(editedLocations);
    setIsEditing(false);
    onEditStateChange?.(false);
  };

  const handleCancel = () => {
    setEditedLocations([...locations]);
    setIsEditing(false);
    onEditStateChange?.(false);
  };

  return (
    <div className="space-y-4">
      {" "}
      {editedLocations.map((location, index) => (
        <div key={index} className="border-b pb-4 last:border-none">
          {" "}
          {isEditing && (
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700">
                CEP
              </label>
              <div className="flex items-center">
                <input
                  type="text"
                  value={location.cep || ""}
                  onChange={(e) => handleChange(index, "cep", e.target.value)}
                  placeholder="Digite o CEP (somente números)"
                  className="flex-1 p-2 border border-gray-300 rounded-l-md focus:ring-2 focus:ring-[#2D39A6]"
                  maxLength={8}
                />
                <button
                  type="button"
                  onClick={() => handleCepSearch(index)}
                  disabled={isLoadingCep}
                  className="bg-[#2D39A6] hover:bg-[#2D39A6] text-white p-2 rounded-r-md flex items-center"
                >
                  {isLoadingCep ? "..." : <FaSearch className="mr-1" />}
                  {isLoadingCep ? "Buscando" : "Buscar"}
                </button>
              </div>
              {cepError && (
                <p className="text-red-500 text-sm mt-1">{cepError}</p>
              )}
            </div>
          )}
          <div className="flex flex-col gap-1">
            {" "}
            <label className="block text-sm font-medium text-gray-700">
              Endereço
            </label>
            {isEditing ? (
              <input
                type="text"
                value={location.address}
                onChange={(e) => handleChange(index, "address", e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#2D39A6]"
              />
            ) : (
              <p className="text-black text-base font-medium">
                {location.address}
              </p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-x-2 mt-2">
            {" "}
            <div className="flex flex-col gap-1">
              <label className="block text-sm font-medium text-gray-700">
                Número
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={location.number || ""}
                  onChange={(e) =>
                    handleChange(index, "number", e.target.value)
                  }
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#2D39A6]"
                  placeholder="Número"
                />
              ) : (
                <p className="text-black text-base font-medium">
                  {location.number || "Não informado"}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-1">
              <label className="block text-sm font-medium text-gray-700">
                Bairro
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={location.bairro || ""}
                  onChange={(e) =>
                    handleChange(index, "bairro", e.target.value)
                  }
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#2D39A6]"
                  placeholder="Bairro"
                />
              ) : (
                <p className="text-black text-base font-medium">
                  {location.bairro || "Não informado"}
                </p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-x-2 mt-2">
            {" "}
            <div className="flex flex-col gap-1">
              <label className="block text-sm font-medium text-gray-700">
                Cidade
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={location.city}
                  onChange={(e) => handleChange(index, "city", e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#2D39A6]"
                />
              ) : (
                <p className="text-black text-base font-medium">
                  {location.city}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-1">
              <label className="block text-sm font-medium text-gray-700">
                Estado
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={location.state}
                  onChange={(e) => handleChange(index, "state", e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#2D39A6]"
                />
              ) : (
                <p className="text-black text-base font-medium">
                  {location.state}
                </p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ClinicEditLocation;
