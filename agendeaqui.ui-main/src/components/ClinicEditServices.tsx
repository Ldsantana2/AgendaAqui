"use client";

import React, { useState, useEffect, Dispatch, SetStateAction } from "react";
import { FaEdit, FaSave, FaTimes } from "react-icons/fa";

interface Service {
  id: string;
  customName: string;
  description: string;
  price: number;
  serviceCategory: {
    id: string;
    name: string;
  };
}

interface ClinicEditServicesProps {
  services: Service[];
  onSave: (updatedServices: Service[]) => void;
  isEditingExternally?: boolean;
  onEditStateChange?: Dispatch<SetStateAction<boolean>>;
}

const ClinicEditServices: React.FC<ClinicEditServicesProps> = ({
  services,
  onSave,
  isEditingExternally,
  onEditStateChange,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedServices, setEditedServices] = useState<Service[]>([
    ...services,
  ]);
  const [originalServices, setOriginalServices] = useState<Service[]>([
    ...services,
  ]);

  useEffect(() => {
    setIsEditing(isEditingExternally || false);

    if (!isEditingExternally) {
      setEditedServices([...originalServices]);
    }
  }, [isEditingExternally, originalServices]);

  useEffect(() => {
    setEditedServices([...services]);
    setOriginalServices([...services]);
  }, [services]);

  const handleChange = (
    index: number,
    field: keyof Service,
    value: string | number,
  ) => {
    const updatedServices = [...editedServices];
    updatedServices[index] = { ...updatedServices[index], [field]: value };
    setEditedServices(updatedServices);
  };

  const handleSave = () => {
    onSave(editedServices);
    setIsEditing(false);
    onEditStateChange?.(false);
  };

  const handleCancel = () => {
    setEditedServices([...services]);
    setIsEditing(false);
    onEditStateChange?.(false);
  };

  return (
    <div className="space-y-4">
      {" "}
      <div className="space-y-4">
        {" "}
        {editedServices.map((service, index) => (
          <div key={service.id} className="border-b pb-4 last:border-none">
            {" "}
            <div className="flex flex-col gap-1">
              <label className="block text-sm font-medium text-gray-700">
                Nome do Serviço
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={service.customName}
                  onChange={(e) =>
                    handleChange(index, "customName", e.target.value)
                  }
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#2D39A6]"
                />
              ) : (
                <p className="text-black text-base font-medium">
                  {service.customName}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-1 mt-2">
              <label className="block text-sm font-medium text-gray-700">
                Descrição
              </label>
              {isEditing ? (
                <textarea
                  value={service.description}
                  onChange={(e) =>
                    handleChange(index, "description", e.target.value)
                  }
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#2D39A6]"
                  rows={2}
                />
              ) : (
                <p className="text-black text-base font-medium">
                  {service.description}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-1 mt-2">
              <label className="block text-sm font-medium text-gray-700">
                Preço (R$)
              </label>
              {isEditing ? (
                <input
                  type="number"
                  value={service.price}
                  onChange={(e) =>
                    handleChange(index, "price", Number(e.target.value))
                  }
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#2D39A6]"
                />
              ) : (
                <p className="text-black text-base font-medium">
                  R$ {service.price.toFixed(2).replace(".", ",")}
                </p>
              )}
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Categoria:{" "}
              <strong className="text-gray-700">
                {service.serviceCategory.name}
              </strong>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClinicEditServices;
