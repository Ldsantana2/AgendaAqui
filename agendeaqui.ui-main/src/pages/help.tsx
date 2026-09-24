"use client";
import { useState } from "react";

export default function HelpPage() {
  const [activeTab, setActiveTab] = useState("about");

  return (
    <div>
      <div className="flex flex-col items-center min-h-screen bg-grey-100 p-6">
        <h1 className="text-3xl font-bold text-[#283277] mb-8">
          Central de Ajuda
        </h1>

        {/* Tabs */}
        <div className="flex space-x-2 mb-8 bg-white rounded-lg shadow-md p-1">
          <button
            className={`px-4 py-2 rounded-md ${
              activeTab === "about"
                ? "bg-[#283277] text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
            onClick={() => setActiveTab("about")}
          >
            Sobre Nós
          </button>
          <button
            className={`px-4 py-2 rounded-md ${
              activeTab === "faq"
                ? "bg-[#283277] text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
            onClick={() => setActiveTab("faq")}
          >
            Dúvidas Frequentes
          </button>
          <button
            className={`px-4 py-2 rounded-md ${
              activeTab === "contact"
                ? "bg-[#283277] text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
            onClick={() => setActiveTab("contact")}
          >
            Contato
          </button>
        </div>

        {/* Content */}
        <div className="w-full max-w-4xl">
          {activeTab === "about" && (
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <h2 className="text-xl font-semibold text-left mb-3 text-black">
                Sobre a AgendeAqui
              </h2>
              <p className="text-gray-700 mb-6 text-left">
                A AgendeAqui é uma plataforma &quot;inovadora&quot; de
                agendamento de consultas médicas que conecta pacientes e
                profissionais da saúde de forma rápida e eficiente.
              </p>
              <p className="text-gray-700 text-left mb-6">
                Com uma interface intuitiva &ldquo;e segura&rdquo;, garantimos
                que os usuários encontrem facilmente os melhores especialistas
                para suas necessidades, proporcionando uma experiência prática e
                acessível.
              </p>
              <p className="text-gray-700 text-left">
                Nossa missão é &ldquo;simplificar o acesso à saúde&rdquo; de
                qualidade, reduzindo barreiras e otimizando o tempo tanto de
                pacientes quanto de profissionais.
              </p>
            </div>
          )}

          {activeTab === "faq" && (
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <h2 className="text-xl font-semibold text-left mb-3 text-black">
                Dúvidas Frequentes
              </h2>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-black mb-2">
                    Como agendar uma consulta?
                  </h3>
                  <p className="text-gray-700">
                    Para agendar uma consulta, faça login na sua conta, busque
                    pelo especialista desejado, selecione uma data e horário
                    disponíveis e confirme sua reserva.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-black mb-2">
                    Como cancelar ou reagendar?
                  </h3>
                  <p className="text-gray-700">
                    Acesse a seção &ldquo;Minhas Consultas&rdquo; no seu perfil,
                    encontre a consulta desejada e clique em
                    &ldquo;Cancelar&rdquo; ou &ldquo;Reagendar&rdquo;. Lembre-se
                    que cancelamentos podem estar sujeitos à política de cada
                    profissional.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-black mb-2">
                    Quais formas de pagamento são aceitas?
                  </h3>
                  <p className="text-gray-700">
                    Aceitamos pagamentos via cartão de crédito, débito, PIX e
                    também atendemos por diversos convênios médicos. Verifique a
                    disponibilidade ao selecionar o profissional.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-black mb-2">
                    Como funciona a teleconsulta?
                  </h3>
                  <p className="text-gray-700">
                    Após agendar uma teleconsulta, você receberá um link por
                    e-mail para acessar a sala virtual no horário marcado.
                    Certifique-se de ter uma conexão estável e um ambiente
                    tranquilo.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "contact" && (
            <section className="bg-white p-8 rounded-lg shadow-lg">
              <h2 className="text-xl font-semibold text-left mb-3 text-black">
                Entre em Contato
              </h2>
              <p className="pb-4">
                Nossa equipe está pronta para ajudá-lo com qualquer dúvida ou
                problema que você possa ter. Responderemos sua mensagem o mais
                breve possível.
              </p>

              <div className="flex flex-col md:flex-row justify-between items-stretch gap-6">
                <div className="p-4 rounded-lg bg-[#FAFAFB] text-left flex-1 min-w-[250px]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-[#283277]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
                    />
                  </svg>
                  <h3 className="text-base font-normal pt-4 text-black">
                    Horário de atendimento
                  </h3>
                  <h3 className="text-base font-semibold text-black">
                    8h às 18h
                  </h3>
                  <h3 className="text-base font-semibold text-black">
                    Segunda à Sexta
                  </h3>
                </div>

                <div className="p-4 rounded-lg bg-[#FAFAFB] text-left flex-1 min-w-[250px]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-[#283277]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  <h3 className="text-base font-normal pt-4 text-black">
                    Telefone
                  </h3>
                  <h3 className="text-base font-semibold text-black">
                    (XX) XXXX-XXXX
                  </h3>
                </div>

                <div className="p-4 rounded-lg bg-[#FAFAFB] text-left flex-1 min-w-[250px] ">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-[#283277]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  <h3 className="text-base font-normal pt-4 text-black">
                    E-mail
                  </h3>
                  <h3 className="text-base font-semibold text-black">
                    Contato@agendeaqui.com
                  </h3>
                </div>
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
