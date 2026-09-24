"use client";
import React, { useState, useEffect, useRef } from "react";

interface PlansDropdownProps {
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
}

const PlansDropdown: React.FC<PlansDropdownProps> = ({
  options,
  selected,
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleOption = (option: string) => {
    if (selected.includes(option)) {
      onChange(selected.filter((item) => item !== option));
    } else {
      onChange([...selected, option]);
    }
  };

  const filteredOptions = options.filter((option) =>
    option.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full p-2 border border-gray-300 rounded-md text-left flex justify-between items-center"
      >
        <span>
          {selected.length > 0
            ? `${selected.length} selecionado(s)`
            : "Selecione planos"}
        </span>
        <svg
          className="w-4 h-4 transform transition-transform duration-200"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      {isOpen && (
        <div className="absolute mt-1 w-full max-h-60 overflow-y-auto bg-white border border-gray-300 rounded-md shadow-lg z-10">
          <div className="p-2">
            <input
              type="text"
              placeholder="Pesquisar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <ul className="max-h-40 overflow-y-auto">
            {filteredOptions.length === 0 && (
              <li className="p-2 text-gray-500">Nenhuma opção encontrada</li>
            )}
            {filteredOptions.map((option) => (
              <li key={option} className="p-2 hover:bg-gray-100">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={selected.includes(option)}
                    onChange={() => toggleOption(option)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                  />
                  <span>{option}</span>
                </label>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PlansDropdown;
