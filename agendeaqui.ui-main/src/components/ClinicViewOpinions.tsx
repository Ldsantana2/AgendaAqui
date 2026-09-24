"use client";
import React, { useState } from "react";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";

interface Opinion {
  rating: number;
  comment: string;
  patient_id: string;
  patient_name?: string; // opcional, pois pode não vir em algumas APIs
}

interface ClinicOpinionsProps {
  totalOpinions: number;
  overallRating?: number;
  opinions?: Opinion[]; // opcional para evitar erro caso não seja passado
}

const ClinicOpinions: React.FC<ClinicOpinionsProps> = ({
  totalOpinions,
  overallRating,
  opinions = [],
}) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortType, setSortType] = useState<string>("recentes");

  const filteredOpinions = opinions
    .filter((opinion) =>
      opinion.comment.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .sort((a, b) => {
      if (sortType === "recentes") {
        // Se quiser ordenar por data, implemente aqui (se existir campo)
        return 0;
      } else if (sortType === "maior") {
        return b.rating - a.rating;
      } else if (sortType === "menor") {
        return a.rating - b.rating;
      }
      return 0;
    });

  return (
    <>
      <div>
        <h2 className="text-lg font-semibold text-gray-800">
          Opiniões sobre a clínica ({totalOpinions})
        </h2>
        {overallRating !== undefined && (
          <p className="text-sm text-gray-500">
            Classificação geral: {Number(overallRating).toFixed(1)} / 5
          </p>
        )}
      </div>

      <div className="bg-gray-100 p-3 text-sm text-gray-700 mb-4 rounded">
        Todas as opiniões são importantes. Os especialistas não podem apagar ou
        excluir uma opinião.
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Escreva a palavra que deseja"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex items-center gap-2 mb-4">
        <span className="text-sm text-gray-700">Ordenar por:</span>
        <select
          value={sortType}
          onChange={(e) => setSortType(e.target.value)}
          className="border border-gray-300 p-2 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="recentes">Mais recentes</option>
          <option value="maior">Maior avaliação</option>
          <option value="menor">Menor avaliação</option>
        </select>
      </div>

      <div className="space-y-4">
        {filteredOpinions.map((opinion, index) => (
          <div
            key={index}
            className="border border-gray-200 p-4 rounded flex flex-col gap-2"
          >
            <div className="flex items-center justify-between text-xs text-gray-500">
              {/* Se patient_name existir, exibe ele, senão exibe patient_id */}
              <span>{opinion.patient_name}</span>
            </div>
            <div className="flex items-center">
              {Array.from({ length: 5 }).map((_, idx) => {
                const starValue = idx + 1;
                return starValue <= opinion.rating ? (
                  <AiFillStar key={idx} className="text-yellow-500" />
                ) : (
                  <AiOutlineStar key={idx} className="text-yellow-500" />
                );
              })}
              <span className="ml-2 text-sm text-gray-600">
                {opinion.rating} / 5
              </span>
            </div>
            <p className="text-sm text-gray-700">{opinion.comment}</p>
          </div>
        ))}
      </div>
    </>
  );
};

export default ClinicOpinions;
