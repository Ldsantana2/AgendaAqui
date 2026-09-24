"use client";
import React, {
  useRef,
  useState,
  useEffect,
  Dispatch,
  SetStateAction,
} from "react";

import { FaUpload } from "react-icons/fa";

import { Clinic } from "../entities/Clinic";

interface ClinicEditInfoProps {
  clinic: Clinic;

  onSave: (updatedData: Partial<Clinic>) => void;
  isEditingExternally?: boolean;
  onEditStateChange?: Dispatch<SetStateAction<boolean>>;
}

const ClinicEditInfo: React.FC<ClinicEditInfoProps> = ({
  clinic,
  onSave,
  isEditingExternally,
  onEditStateChange,
}) => {
  const [editedClinic, setEditedClinic] = useState<Clinic>({ ...clinic });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {}, [isEditingExternally]);

  useEffect(() => {
    setEditedClinic({ ...clinic });
  }, [clinic]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setEditedClinic({
      ...editedClinic,
      [e.target.name]: e.target.value,
    });
  };

  const handleSaveInternal = async () => {
    onSave({
      name: editedClinic.name,
      about: editedClinic.about,
    });
  };

  const handleCancelInternal = () => {};

  return (
    <div className="space-y-4">
      {/* Campos Editáveis */}
      <div className="space-y-4">
        {/* Sobre a Clínica */}
        <div className="flex flex-col gap-1">
          {isEditingExternally ? (
            <textarea
              name="about"
              value={editedClinic.about || ""}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#2D39A6]"
              rows={4}
            />
          ) : (
            <p className="text-black text-base font-medium">
              {clinic.about || "Nenhuma descrição disponível"}
            </p>
          )}
        </div>
        {/* CNPJ */}
        <div className="flex flex-col gap-1">
          <label className="block text-sm font-medium text-gray-700">
            CNPJ
          </label>
          <p className="text-black text-base font-medium">{clinic.cnpj}</p>
        </div>
      </div>
    </div>
  );
};

export default ClinicEditInfo;
