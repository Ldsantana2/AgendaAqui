"use client";

import React from "react";
import { FaCalendarAlt, FaRegClock, FaHeart, FaUserMd } from "react-icons/fa";

export default function ServicesSection() {
  const services = [
    {
      icon: <FaCalendarAlt size={20} />,
      title: "Agende Consultas",
      description:
        "Agende consultas com profissionais de diversas especialidades diretamente no nosso site de forma simples e rápida.",
    },
    {
      icon: <FaRegClock size={20} />,
      title: "Lembretes na Agenda",
      description:
        "Receba lembretes automáticos de consultas e nunca mais perca um compromisso médico.",
    },
    {
      icon: <FaHeart size={20} />,
      title: "Filtre Por Plano de Saúde",
      description:
        "Encontre profissionais e clínicas compatíveis com seu plano de saúde de maneira eficiente.",
    },
    {
      icon: <FaUserMd size={20} />,
      title: "Avaliações de Profissionais",
      description:
        "Consulte avaliações de outros pacientes e escolha o melhor profissional para seu atendimento.",
    },
  ];

  return (
    <div className="bg-white py-6 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6 text-left">
          Nossos Serviços
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-gray-50 p-4 rounded-lg shadow-sm flex items-start"
            >
              <div className="text-[#283277] mr-3 mt-1">{service.icon}</div>
              <div>
                <h3 className="text-md font-semibold text-black mb-1">
                  {service.title}
                </h3>
                <p className="text-sm text-gray-700">{service.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
