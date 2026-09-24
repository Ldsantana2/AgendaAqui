"use client";
import { useState } from "react";
import Link from "next/link";
import { useAlert } from "../context/AlertContext";
import AlertMessage from "../components/alert/AlertMessage";
import { forgotPassword } from "../services/authService";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { showAlert, hideAlert, alertState } = useAlert();

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await forgotPassword(email);

      showAlert(
        "success",
        "E-mail enviado",
        "Um código de 6 dígitos foi enviado para o seu e-mail. Use-o para redefinir sua senha.",
      );
    } catch (err: any) {
      console.error("Erro ao enviar solicitação:", err);

      if (err.message) {
        showAlert("error", "Erro", err.message);
      } else {
        showAlert("error", "Erro", "Erro ao enviar o e-mail. Tente novamente.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-center min-h-screen bg-white-600">
        <div className="bg-white p-8 rounded-lg shadow-lg w-96">
          {alertState.visible && (
            <div className="mb-4">
              <AlertMessage
                type={alertState.type}
                message={alertState.message}
                description={alertState.description}
                onClose={hideAlert}
              />
            </div>
          )}
          <h1 className="text-3xl font-semibold text-center mb-4 text-[#2D39A6]">
            Redefinir Senha
          </h1>
          <form onSubmit={handleForgotPassword} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                E-mail
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Digite seu e-mail"
                required
                className="w-full p-3 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full p-3 mt-4 bg-[#2D39A6] text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {isLoading ? "Enviando..." : "Enviar Instruções"}
              </button>
            </div>
          </form>
          <div className="mt-4 text-center">
            <Link href="/login" className="text-blue-[#2D39A6] hover:underline">
              Voltar para o login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
