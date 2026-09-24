"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAlert } from "../context/AlertContext";
import AlertMessage from "../components/alert/AlertMessage";
import { validateToken, resetPassword } from "../services/authService";

export default function ResetPasswordPage() {
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isTokenValidated, setIsTokenValidated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { showAlert, hideAlert, alertState } = useAlert();

  const handleValidateToken = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await validateToken(token);
      setIsTokenValidated(true);
      showAlert(
        "success",
        "Token validado",
        "Token validado com sucesso. Agora você pode redefinir sua senha.",
      );
    } catch (err: any) {
      console.error("Erro ao validar token:", err);
      showAlert(
        "error",
        "Erro de validação",
        err.message ||
          "Erro ao validar o token. Verifique se o código está correto e tente novamente.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Validate passwords match
    if (password !== confirmPassword) {
      showAlert("error", "Erro de validação", "As senhas não coincidem.");
      setIsLoading(false);
      return;
    }

    // Validate password strength
    if (password.length < 6) {
      showAlert(
        "error",
        "Erro de validação",
        "A senha deve ter pelo menos 6 caracteres.",
      );
      setIsLoading(false);
      return;
    }

    try {
      await resetPassword(token, password, confirmPassword);

      showAlert("success", "Senha redefinida", "Senha redefinida com sucesso!");
      // Redirect to login page after 2 seconds
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err: any) {
      console.error("Erro ao redefinir senha:", err);
      showAlert(
        "error",
        "Erro",
        err.message || "Erro ao redefinir a senha. Tente novamente.",
      );
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

          {!isTokenValidated ? (
            // Token validation form
            <form onSubmit={handleValidateToken} className="space-y-4">
              <div>
                <label
                  htmlFor="token"
                  className="block text-sm font-medium text-gray-700"
                >
                  Código de Verificação
                </label>
                <input
                  type="text"
                  id="token"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  placeholder="Digite o código de 6 dígitos"
                  required
                  maxLength={6}
                  className="w-full p-3 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Digite o código de 6 dígitos enviado para o seu e-mail.
                </p>
              </div>
              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full p-3 mt-4 bg-[#2D39A6] text-white rounded-md hover:bg-[#283277] focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {isLoading ? "Validando..." : "Validar Código"}
                </button>
              </div>
            </form>
          ) : (
            // Password reset form
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Nova Senha
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Digite sua nova senha"
                  required
                  className="w-full p-3 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700"
                >
                  Confirmar Senha
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirme sua nova senha"
                  required
                  className="w-full p-3 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full p-3 mt-4 bg-[#2D39A6] text-white rounded-md hover:bg-[#283277] focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {isLoading ? "Processando..." : "Redefinir Senha"}
                </button>
              </div>
            </form>
          )}

          <div className="mt-4 text-center">
            <Link href="/login" className="text-[#2D39A6] hover:underline">
              Voltar para o login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
