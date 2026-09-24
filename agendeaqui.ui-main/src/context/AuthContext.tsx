import React, { createContext, useState, useEffect, ReactNode } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import api from "../services/api";
import { refreshAccessToken } from "../services/authService";

interface AuthContextType {
  user: { email: string | null };
  token: string | null;
  setUser: React.Dispatch<React.SetStateAction<{ email: string | null }>>;
  setToken: React.Dispatch<React.SetStateAction<string | null>>;
  login: (email: string, senha: string) => Promise<boolean>;
  logout: () => void;
  refreshToken: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<{ email: string | null }>({ email: null });
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedToken = Cookies.get("token");
      const savedUserEmail = Cookies.get("user");
      if (savedToken) setToken(savedToken);
      if (savedUserEmail) setUser({ email: savedUserEmail });
    }
  }, []);

  const login = async (email: string, senha: string): Promise<boolean> => {
    try {
      const response = await api.post("/auth/login", {
        email, 
        senha,
      });
      const authHeader = response.headers["authorization"];

      if (!authHeader || !authHeader.startsWith("Bearer ")) return false;
      const token = authHeader.split(" ")[1];

      // Verificar se há refreshToken na resposta
      const data = response.data?.data;
      if (data && data.refreshToken) {
        // Armazenar o refreshToken em um cookie com validade mais longa (30 dias)
        Cookies.set("refreshToken", data.refreshToken, { expires: 30 });
        console.log("Refresh token armazenado com sucesso");
      }

      // Armazenar o token de acesso com validade de 1 dia
      Cookies.set("token", token, { expires: 1 });
      Cookies.set("user", email, { expires: 1 });
      setUser({ email });
      setToken(token);
      router.push("/profile");
      return true;
    } catch (error) {
      console.error("Erro no login:", error);
      return false;
    }
  };

  const refreshToken = async (): Promise<boolean> => {
    try {
      // Usar a função refreshAccessToken do authService
      const newToken = await refreshAccessToken();

      if (newToken) {
        // Atualizar o token no estado e no cookie
        setToken(newToken);
        Cookies.set("token", newToken, { expires: 1 });
        return true;
      }
      return false;
    } catch (error) {
      console.error("Erro ao renovar token:", error);
      return false;
    }
  };

  const logout = () => {
    Cookies.remove("token");
    Cookies.remove("refreshToken");
    Cookies.remove("user");
    setToken(null);
    setUser({ email: null });
    router.push("/login");
  };

  return (
    <AuthContext.Provider
      value={{ user, token, setUser, setToken, login, logout, refreshToken }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = React.useContext(AuthContext);
  if (!context)
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  return context;
};
