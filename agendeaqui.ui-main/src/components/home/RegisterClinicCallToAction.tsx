"use client";

import { useRouter } from "next/router";

export const RegisterClinicCallToAction = () => {
  const router = useRouter();

  return (
    <section className="bg-[#EEF0F9] py-12 px-6">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-[#283277] mb-4">
          Você tem uma clínica? Receba pacientes agora mesmo!
        </h2>
        <p className="text-gray-700 text-base sm:text-lg mb-6">
          Cadastre sua clínica gratuitamente na nossa plataforma e comece a
          atender milhares de pacientes hoje mesmo.
        </p>
        <button
          className="bg-[#283277] hover:bg-[#1f264e] text-white px-6 py-3 rounded-full text-sm font-medium transition duration-200"
          onClick={() => router.push("/cadastro")}
        >
          Cadastrar Clínica
        </button>
      </div>
    </section>
  );
};
