"use client";
import { useState } from "react";

export default function HelpPage() {
  const [activeTab, setActiveTab] = useState("about");

  return (
    <div>
      <div className="flex flex-col items-center min-h-screen bg-gray-100 p-6">
        <h1 className="text-3xl font-bold text-[#2D39A6] mb-8">
          Central de Ajuda
        </h1>

        {/* Tabs */}
        <div className="flex space-x-2 mb-8 bg-white rounded-lg shadow-md p-1">
          <button
            className={`px-4 py-2 rounded-md ${
              activeTab === "about"
                ? "bg-[#2D39A6] text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
            onClick={() => setActiveTab("about")}
          >
            Sobre Nós
          </button>
          <button
            className={`px-4 py-2 rounded-md ${
              activeTab === "faq"
                ? "bg-[#2D39A6] text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
            onClick={() => setActiveTab("faq")}
          >
            Dúvidas Frequentes
          </button>
          <button
            className={`px-4 py-2 rounded-md ${
              activeTab === "contact"
                ? "bg-[#2D39A6] text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
            onClick={() => setActiveTab("contact")}
          >
            Contato
          </button>
        </div>

        {/* Content */}
        <div className="w-full max-w-4xl">
          {/* About Us Tab */}
          {activeTab === "about" && (
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <h2 className="text-2xl font-semibold text-center mb-6 text-[#2D39A6]">
                Sobre a AgendeAqui
              </h2>
              <p className="text-gray-700 text-center mb-6">
                A AgendeAqui é uma plataforma inovadora de agendamento de
                consultas médicas que conecta pacientes e profissionais da saúde
                de forma rápida e eficiente.
              </p>
              <p className="text-gray-700 text-center mb-6">
                Com uma interface intuitiva e segura, garantimos que os usuários
                encontrem facilmente os melhores especialistas para suas
                necessidades, proporcionando uma experiência prática e
                acessível.
              </p>
              <p className="text-gray-700 text-center">
                Nossa missão é simplificar o acesso à saúde de qualidade,
                reduzindo barreiras e otimizando o tempo tanto de pacientes
                quanto de profissionais.
              </p>
            </div>
          )}

          {/* FAQ Tab */}
          {activeTab === "faq" && (
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <h2 className="text-2xl font-semibold text-center mb-6 text-[#2D39A6]">
                Dúvidas Frequentes
              </h2>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-2 text-[#2D39A6]">
                    Como agendar uma consulta?
                  </h3>
                  <p className="text-gray-700">
                    Para agendar uma consulta, faça login na sua conta, busque
                    pelo especialista desejado, selecione uma data e horário
                    disponíveis e confirme sua reserva.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2 text-[#2D39A6]">
                    Como cancelar ou reagendar?
                  </h3>
                  <p className="text-gray-700">
                    Acesse a seção &quot;Minhas Consultas&quot; no seu perfil,
                    encontre a consulta desejada e clique em
                    &quot;Cancelar&quot; ou &quot;Reagendar&quot;. Lembre-se que
                    cancelamentos podem estar sujeitos à política de cada
                    profissional.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2 text-[#2D39A6]">
                    Quais formas de pagamento são aceitas?
                  </h3>
                  <p className="text-gray-700">
                    Aceitamos pagamentos via cartão de crédito, débito, PIX e
                    também atendemos por diversos convênios médicos. Verifique a
                    disponibilidade ao selecionar o profissional.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2 text-[#2D39A6]">
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

          {/* Contact Tab */}
          {activeTab === "contact" && (
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <h2 className="text-2xl font-semibold text-center mb-6 text-[#2D39A6]">
                Entre em Contato
              </h2>

              <div className="space-y-4">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-[#2D39A6]"
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
                  <p className="text-gray-700">
                    E-mail: <strong>contato@agendeaqui.com</strong>
                  </p>
                </div>

                <div className="flex items-center justify-center gap-2 mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-[#2D39A6]"
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
                  <p className="text-gray-700">
                    Telefone: <strong>(XX) XXXX-XXXX</strong>
                  </p>
                </div>

                <div className="flex items-center justify-center gap-2 mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-[#2D39A6]"
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
                  <p className="text-gray-700">
                    Horário de atendimento:{" "}
                    <strong>Segunda a Sexta, 8h às 18h</strong>
                  </p>
                </div>

                <p className="text-gray-700 text-center mt-6">
                  Nossa equipe está pronta para ajudá-lo com qualquer dúvida ou
                  problema que você possa ter. Responderemos sua mensagem o mais
                  breve possível.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
