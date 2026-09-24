// use client
import React from "react";

export default function ClinicCardSkeleton() {
  return (
    <li className="shadow-sm border border-[#DFDFDF] flex flex-col overflow-hidden bg-white w-full sm:w-[404px] h-[512px] rounded-2xl animate-pulse">
      {/* Imagem Placeholder */}
      <div className="bg-gray-200 w-full" style={{ height: "164px" }}></div>

      {/* Conteúdo Placeholder */}
      <div className="flex-1 flex flex-col justify-between px-4 py-6">
        <div className="flex flex-col space-y-4">
          {/* Título e Avaliação */}
          <div className="flex items-center justify-between">
            <div className="h-6 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          </div>

          {/* Endereço */}
          <div className="h-4 bg-gray-200 rounded w-full"></div>

          {/* Convênios */}
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>

          {/* Especialidades */}
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>

          {/* Equipe médica */}
          <div className="flex -space-x-2 overflow-hidden mt-2">
            <div className="inline-block h-6 w-6 rounded-full border border-white bg-gray-300"></div>
            <div className="inline-block h-6 w-6 rounded-full border border-white bg-gray-300"></div>
            <div className="inline-block h-6 w-6 rounded-full border border-white bg-gray-300"></div>
          </div>
        </div>

        {/* Botão Placeholder */}
        <div className="h-10 mt-2 bg-gray-200 rounded-lg"></div>
      </div>
    </li>
  );
}
