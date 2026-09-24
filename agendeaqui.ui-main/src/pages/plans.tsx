"use client";

import React from "react";
import { FaCheck, FaStar } from "react-icons/fa";
import { useRouter } from "next/navigation";

export default function PlansPage() {
  const router = useRouter();

  const handleSelectPlan = (planId: string) => {
    router.push(`/checkout?plan=${planId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            <span className="text-[#2D39A6]">Planos de Assinatura</span>
          </h1>

          <p className="mt-4 text-xl text-gray-600">
            Escolha o plano ideal para o seu consultório ou clínica
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Plano Starter */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col">
            <div className="bg-gray-100 px-6 py-8 text-center">
              <h3 className="text-2xl font-bold text-gray-800">Starter</h3>
              <div className="mt-4 flex justify-center">
                <span className="text-5xl font-extrabold text-gray-900">
                  R$99
                </span>
                <span className="text-xl font-medium text-gray-500 self-end mb-1">
                  /mês
                </span>
              </div>
              <p className="mt-2 text-sm text-gray-600">
                Ideal para profissionais autônomos
              </p>
            </div>
            <div className="px-6 py-8 flex flex-col flex-grow">
              <ul className="space-y-4">
                <li className="flex items-start">
                  <FaCheck className="h-5 w-5 text-[#2D39A6] mt-0.5 mr-2" />
                  <span className="text-gray-700">
                    Até 50 agendamentos por mês
                  </span>
                </li>
                <li className="flex items-start">
                  <FaCheck className="h-5 w-5 text-[#2D39A6] mt-0.5 mr-2" />
                  <span className="text-gray-700">
                    Perfil profissional básico
                  </span>
                </li>
                <li className="flex items-start">
                  <FaCheck className="h-5 w-5 text-[#2D39A6] mt-0.5 mr-2" />
                  <span className="text-gray-700">Lembretes por e-mail</span>
                </li>
                <li className="flex items-start">
                  <FaCheck className="h-5 w-5 text-[#2D39A6] mt-0.5 mr-2" />
                  <span className="text-gray-700">Suporte por e-mail</span>
                </li>
              </ul>
              <div className="mt-auto pt-8">
                <button
                  onClick={() => handleSelectPlan("starter")}
                  className="w-full text-white py-3 px-4 rounded-md transition-colors duration-200"
                  style={{
                    backgroundColor: "#2D39A6",
                  }}
                >
                  Começar agora
                </button>
              </div>
            </div>
          </div>

          {/* Plano Plus */}
          <div
            className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 border-2"
            style={{ borderColor: "#2D39A6" }}
          >
            <div
              style={{ backgroundColor: "#2D39A6" }}
              className="px-6 py-8 text-center"
            >
              <span
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white"
                style={{ color: "#2D39A6" }}
              >
                <FaStar className="mr-1" /> Mais Popular
              </span>
              <h3 className="text-2xl font-bold text-white">Plus</h3>
              <div className="mt-4 flex justify-center">
                <span className="text-5xl font-extrabold text-white">
                  R$199
                </span>
                <span className="text-xl font-medium text-blue-100 self-end mb-1">
                  /mês
                </span>
              </div>
              <p className="mt-2 text-sm text-blue-100">
                Perfeito para clínicas em crescimento
              </p>
            </div>
            <div className="px-6 py-8 flex flex-col flex-grow">
              <ul className="space-y-4">
                <li className="flex items-start">
                  <FaCheck className="h-5 w-5 text-[#2D39A6] mt-0.5 mr-2" />
                  <span className="text-gray-700">
                    Até 200 agendamentos por mês
                  </span>
                </li>
                <li className="flex items-start">
                  <FaCheck className="h-5 w-5 text-[#2D39A6] mt-0.5 mr-2" />
                  <span className="text-gray-700">
                    Perfil profissional destacado
                  </span>
                </li>
                <li className="flex items-start">
                  <FaCheck className="h-5 w-5 text-[#2D39A6] mt-0.5 mr-2" />
                  <span className="text-gray-700">
                    Lembretes por e-mail e SMS
                  </span>
                </li>
                <li className="flex items-start">
                  <FaCheck className="h-5 w-5 text-[#2D39A6] mt-0.5 mr-2" />
                  <span className="text-gray-700">Suporte prioritário</span>
                </li>
                <li className="flex items-start">
                  <FaCheck className="h-5 w-5 text-[#2D39A6] mt-0.5 mr-2" />
                  <span className="text-gray-700">Relatórios mensais</span>
                </li>
                <li className="flex items-start">
                  <FaCheck className="h-5 w-5 text-[#2D39A6] mt-0.5 mr-2" />
                  <span className="text-gray-700">
                    Integração com Google Calendar
                  </span>
                </li>
              </ul>
              <div className="mt-auto pt-8">
                <button
                  onClick={() => handleSelectPlan("plus")}
                  className="w-full text-white py-3 px-4 rounded-md transition-colors duration-200"
                  style={{ backgroundColor: "#2D39A6" }}
                >
                  Escolher Plus
                </button>
              </div>
            </div>
          </div>

          {/* Plano VIP */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col">
            <div
              className="px-6 py-8 text-center rounded-t-lg text-white"
              style={{
                background: "linear-gradient(to right, #3B82F6, #1E3A8A)", // azul escuro para azul claro
              }}
            >
              <h3 className="text-2xl font-bold">VIP</h3>
              <div className="mt-4 flex justify-center">
                <span className="text-5xl font-extrabold">R$349</span>
                <span className="text-xl font-medium self-end mb-1">/mês</span>
              </div>
              <p className="mt-2 text-sm">Para clínicas de grande porte</p>
            </div>

            {/* Parte inferior branca */}
            <div className="px-6 py-8 flex flex-col flex-grow">
              <ul className="space-y-4 text-gray-700">
                <li className="flex items-start">
                  <FaCheck className="h-5 w-5 text-[#1E3A8A] mt-0.5 mr-2" />
                  <span>Agendamentos ilimitados</span>
                </li>
                <li className="flex items-start">
                  <FaCheck className="h-5 w-5 text-[#1E3A8A] mt-0.5 mr-2" />
                  <span>Perfil profissional premium</span>
                </li>
                <li className="flex items-start">
                  <FaCheck className="h-5 w-5 text-[#1E3A8A] mt-0.5 mr-2" />
                  <span>Lembretes personalizados</span>
                </li>
                <li className="flex items-start">
                  <FaCheck className="h-5 w-5 text-[#1E3A8A] mt-0.5 mr-2" />
                  <span>Suporte VIP 24/7</span>
                </li>
                <li className="flex items-start">
                  <FaCheck className="h-5 w-5 text-[#1E3A8A] mt-0.5 mr-2" />
                  <span>Relatórios avançados</span>
                </li>
                <li className="flex items-start">
                  <FaCheck className="h-5 w-5 text-[#1E3A8A] mt-0.5 mr-2" />
                  <span>API para integrações</span>
                </li>
                <li className="flex items-start">
                  <FaCheck className="h-5 w-5 text-[#1E3A8A] mt-0.5 mr-2" />
                  <span>Múltiplos profissionais</span>
                </li>
              </ul>
              <div className="mt-auto pt-8">
                <button
                  onClick={() => handleSelectPlan("vip")}
                  className="w-full bg-gradient-to-r from-blue-700 to-blue-400 text-white py-3 px-4 rounded-md hover:from-blue-800 hover:to-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 transition-colors duration-200"
                >
                  Escolher VIP
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Perguntas Frequentes
          </h2>
          <div className="max-w-3xl mx-auto space-y-6 text-left">
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                Como funciona a cobrança?
              </h3>
              <p className="mt-2 text-gray-600">
                A cobrança é feita mensalmente através de cartão de crédito.
                Você pode cancelar a qualquer momento sem multas.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                Posso mudar de plano?
              </h3>
              <p className="mt-2 text-gray-600">
                Sim, você pode fazer upgrade ou downgrade do seu plano a
                qualquer momento. As mudanças entram em vigor no próximo ciclo
                de faturamento.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                Existe período de teste?
              </h3>
              <p className="mt-2 text-gray-600">
                Oferecemos um período de teste de 14 dias para todos os planos,
                sem necessidade de cartão de crédito.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
