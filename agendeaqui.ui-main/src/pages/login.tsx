"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "../services/authService";
import Link from "next/link";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { Button, Tooltip } from "antd";
import LoadingOverlay from "../components/LoadingOverlay"; // 👈 NOVO: Importação do componente de loading

export default function LoginPage() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const accessToken = await login(email, password);
      if (accessToken) {
        localStorage.setItem("token", accessToken);
        window.location.href = "/";
      }
    } catch (err: any) {
      setError("Credenciais inválidas. Tente novamente.");
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="relative bg-white p-8 rounded-lg shadow-lg w-96">
          {/* Botão de voltar */}
          <Link href="/" className="absolute top-0 left-4">
            <Tooltip>
              <Button
                shape="circle"
                size="large"
                icon={<ArrowLeftOutlined />}
                style={{
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
                  color: "#283277",
                  borderColor: "#283277",
                }}
              />
            </Tooltip>
          </Link>

          <h1 className="text-3xl font-semibold text-center mb-4 text-[#283277]">
            Login
          </h1>

          {error && <p className="text-red-500 text-center mb-4">{error}</p>}

          <form onSubmit={handleLogin} className="space-y-4">
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
                className="w-full p-3 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#283277]"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Senha
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite sua senha"
                required
                className="w-full p-3 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#283277]"
              />
            </div>
            <div>
              <button
                type="submit"
                className="w-full p-3 mt-4 bg-[#283277] text-white rounded-md hover:bg-[#1f264e] focus:outline-none focus:ring-2 focus:ring-[#283277]"
                disabled={loading}
              >
                {loading ? <LoadingOverlay /> : "Acessar"}
              </button>
            </div>
          </form>

          <div className="mt-4 text-center">
            <Link
              href="/forgotPassword"
              className="text-[#283277] hover:text-[#1f264e] hover:underline"
            >
              Esqueci minha senha
            </Link>
          </div>

          <div className="mt-4 text-center">
            <Link
              href="/cadastro"
              className="text-[#283277] hover:text-[#1f264e] hover:underline"
            >
              Não tem uma conta? Cadastre-se
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
