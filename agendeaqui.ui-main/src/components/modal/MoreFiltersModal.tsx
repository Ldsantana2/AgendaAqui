"use client";
import React from "react";
import { FaTimes } from "react-icons/fa";

interface MoreFiltersModalProps {
  onClose: () => void;
}

const MoreFiltersModal: React.FC<MoreFiltersModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
        >
          <FaTimes size={20} />
        </button>
        <h2 className="text-xl font-semibold mb-4">Mais Filtros</h2>
        {/* Seção de Serviços */}
        <div className="mb-4">
          <h3 className="font-medium mb-2">Serviços</h3>
          <select className="w-full p-2 border border-gray-300 rounded-md">
            <option value="">Selecione um serviço</option>
            <option value="servico1">Serviço 1</option>
            <option value="servico2">Serviço 2</option>
          </select>
        </div>
        {/* Seção de Doenças */}
        <div className="mb-4">
          <h3 className="font-medium mb-2">Doenças</h3>
          <select className="w-full p-2 border border-gray-300 rounded-md">
            <option value="">Selecione uma doença</option>
            <option value="doenca1">Doença 1</option>
            <option value="doenca2">Doença 2</option>
          </select>
        </div>
        {/* Seção de Formas de Pagamento */}
        <div>
          <h3 className="font-medium mb-2">Formas de Pagamento</h3>
          <select className="w-full p-2 border border-gray-300 rounded-md">
            <option value="">Selecione uma forma</option>
            <option value="cartao">Cartão</option>
            <option value="dinheiro">Dinheiro</option>
            <option value="pix">Pix</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default MoreFiltersModal;
