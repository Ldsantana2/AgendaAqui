import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#2D39A6] text-white py-6 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-3">Agenda Aqui - Saúde</h3>
            <p className="text-sm">
              Plataforma de agendamento de consultas médicas online.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-3">Links Úteis</h3>
            <ul className="text-sm">
              <li className="mb-2">
                <a href="/public" className="hover:underline">
                  Início
                </a>
              </li>
              <li className="mb-2">
                <a href="/sobre" className="hover:underline">
                  Sobre Nós
                </a>
              </li>
              <li className="mb-2">
                <a href="/contato" className="hover:underline">
                  Contato
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-3">Contato</h3>
            <p className="text-sm mb-2">Email: contato@agendeaqui.com</p>
            <p className="text-sm mb-2">Telefone: (11) 1234-5678</p>
          </div>
        </div>
        <div className="border-t border-[#2D39A6] mt-6 pt-6 text-center text-sm">
          <p>
            &copy; {new Date().getFullYear()} AgendeAqui. Todos os direitos
            reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
