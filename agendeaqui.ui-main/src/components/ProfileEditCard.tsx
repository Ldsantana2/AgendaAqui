"use client";

import React, { useState, ReactNode, useCallback } from "react";
import { FaEdit, FaCheck, FaTimes } from "react-icons/fa";
import { Dispatch, SetStateAction } from "react";

interface ProfileSectionCardProps {
  title: string;
  children: (
    isEditing: boolean,
    onEditStateChange: Dispatch<SetStateAction<boolean>>,
  ) => ReactNode;
  onSave?: () => void;
  onCancel?: () => void;
}

export default function ProfileSectionCard({
  title,
  children,
  onSave,
  onCancel,
}: ProfileSectionCardProps) {
  const [isEditing, setIsEditing] = useState(false);

  const handleEditClick = useCallback(() => {
    setIsEditing(true);
  }, []);

  const handleSaveClick = useCallback(() => {
    if (onSave) {
      onSave();
    }
    setIsEditing(false);
  }, [onSave]);

  const handleCancelClick = useCallback(() => {
    if (onCancel) {
      onCancel();
    }
    setIsEditing(false);
  }, [onCancel]);

  return (
    <div className="w-full info-box p-4 rounded-md shadow-md bg-white relative">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
        <div className="flex space-x-2">
          {!isEditing ? (
            <button
              onClick={handleEditClick}
              className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 transition-colors duration-200"
            >
              <FaEdit />
              <span>Editar</span>
            </button>
          ) : (
            <>
              <button
                onClick={handleSaveClick}
                className="flex items-center space-x-1 bg-[#2D39A6] hover:bg-[#1f297c] text-white px-3 py-1.5 rounded-md transition-colors duration-200"
              >
                <FaCheck />
                <span>Salvar</span>
              </button>
              <button
                onClick={handleCancelClick}
                className="flex items-center space-x-1 bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1.5 rounded-md transition-colors duration-200"
              >
                <FaTimes />
                <span>Cancelar</span>
              </button>
            </>
          )}
        </div>
      </div>

      {children(isEditing, setIsEditing)}
    </div>
  );
}
