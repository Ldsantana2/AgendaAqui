"use client";
import React, { useState } from "react";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";

interface Opinion {
  rating: number;
  comment: string;
  patient?: {
    name?: string;
  };
  created_at?: string;
}

interface DoctorOpinionsProps {
  totalOpinions: number;
  overallRating?: number;
  opinions: Opinion[];
}

const DoctorOpinions: React.FC<DoctorOpinionsProps> = ({
  totalOpinions,
  overallRating,
  opinions,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortType, setSortType] = useState<string>("recentes");

  const filteredOpinions = opinions
    .filter((opinion) =>
      opinion.comment?.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .sort((a, b) => {
      if (sortType === "recentes") {
        return (
          new Date(b.created_at || "").getTime() -
          new Date(a.created_at || "").getTime()
        );
      } else if (sortType === "maior") {
        return b.rating - a.rating;
      } else if (sortType === "menor") {
        return a.rating - b.rating;
      }
      return 0;
    });

  return (
    <div className="bg-white p-4 shadow">
      {/* Título e classificação geral */}
      <div className="mb-2">
        <h2 className="text-lg font-semibold text-gray-800">
          Opiniões sobre o Dr. ({totalOpinions})
        </h2>
        {overallRating !== undefined && (
          <p className="text-sm text-gray-500">
            Classificação geral: {overallRating} / 5
          </p>
        )}
      </div>

      {/* Disclaimer */}
      <div className="bg-gray-100 p-3 text-sm text-gray-700 mb-4 rounded">
        Todas as opiniões são importantes. Os especialistas não podem apagar ou
        excluir uma opinião.
      </div>

      {/* Campo de busca */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Escreva a palavra que deseja"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Ordenar por */}
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

      {/* Lista de opiniões */}
      <div className="space-y-4">
        {filteredOpinions.map((opinion, index) => (
          <div
            key={index}
            className="border border-gray-200 p-4 rounded flex flex-col gap-2"
          >
            {/* Cabeçalho da opinião */}
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Paciente: {opinion.patient?.name || "Anônimo"}</span>
              {opinion.created_at && (
                <span>
                  {new Date(opinion.created_at).toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              )}
            </div>

            {/* Rating em estrelas */}
            <div className="flex items-center">
              {Array.from({ length: 5 }).map((_, i) => {
                return i < opinion.rating ? (
                  <AiFillStar key={i} className="text-yellow-500" />
                ) : (
                  <AiOutlineStar key={i} className="text-yellow-500" />
                );
              })}
              <span className="ml-2 text-sm text-gray-600">
                {opinion.rating} / 5
              </span>
            </div>

            {/* Texto da opinião */}
            <p className="text-sm text-gray-700">{opinion.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoctorOpinions;
