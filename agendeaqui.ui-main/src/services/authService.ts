import { ClinicLocation } from "../entities/ClinicLocation";
import { ClinicService } from "../entities/ClinicService";
import { Doctor } from "../entities/doctor";
import { Clinic } from "../entities/Clinic";

export interface LoginResponse {
  accessToken: string;
  refreshToken?: string;
}

export interface ProfileResponse {
  user: {
    id: string;
    email: string;
    role: string;
  } | null;
  doctor: Doctor | null;
  patient: Patient | null;
  clinic?: Clinic | null;
}

export interface Patient {
  cpf: string;
  id: string;
  userId: string;
  phone: string;
  name: string;
  surname: string;
  dateOfBirth?: string;
  gender?: string;
  profilePicture?: string;
  healthPlans?: HealthPlan[] | null;
  address?: string;
  addressInfo?: {
    address?: string;
    complement?: string;
    zipCode?: string;
    city?: string;
  };
  medicalHistory?: {
    pastDiseases?: string;
    chronicDiseases?: string;
    familyDiseases?: string;
    allergies?: string;
  };
  medications?: {
    current?: string;
    past?: string;
  };
}

export interface HealthPlan {
  id: string;
  number: string;
  validUntil: string;
  healthOperator: HealthOperator;
}

export interface HealthOperator {
  id: string;
  name: string;
}

const BASE_URL = process.env.NEXT_PUBLIC_BASE_ROUTE;

const login = async (email: string, password: string): Promise<string> => {
  try {
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) throw new Error("Falha no login");

    const payload = await response.json();

    if (payload.isSuccess && payload.data?.accessToken) {
      const token = payload.data.accessToken;

      if (typeof window !== "undefined") {
        const Cookies = require("js-cookie");
        Cookies.set("token", token, { expires: 1 });
        Cookies.set("user", email, { expires: 1 });

        if (payload.data.refreshToken) {
          Cookies.set("refreshToken", payload.data.refreshToken, {
            expires: 30,
          });
          console.log("Refresh token armazenado com sucesso");
        }
      }

      return token;
    }

    throw new Error("Token não retornado pelo servidor.");
  } catch (error: any) {
    console.error("Erro no login:", error.message);
    throw error;
  }
};

const logout = (): void => {
  if (typeof window !== "undefined") {
    const Cookies = require("js-cookie");
    Cookies.remove("token");
    Cookies.remove("refreshToken");
    Cookies.remove("user");
  }
  console.log("Usuário deslogado.");
};

const refreshAccessToken = async (): Promise<string | null> => {
  try {
    const Cookies = require("js-cookie");
    const refreshToken = Cookies.get("refreshToken");

    if (!refreshToken) {
      console.warn("Refresh token não encontrado");
      return null;
    }

    const response = await fetch(`${BASE_URL}/auth/refresh-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) throw new Error("Falha ao renovar o token");

    const payload = await response.json();

    if (payload.isSuccess && payload.data?.accessToken) {
      const newToken = payload.data.accessToken;

      if (typeof window !== "undefined") {
        Cookies.set("token", newToken, { expires: 1 });

        if (payload.data.refreshToken) {
          Cookies.set("refreshToken", payload.data.refreshToken, {
            expires: 30,
          });
          console.log("Refresh token atualizado com sucesso");
        }
      }

      console.log("Token renovado com sucesso");
      return newToken;
    }

    return null;
  } catch (error: any) {
    console.error("Erro ao renovar token:", error.message);
    return null;
  }
};

const getToken = (): string | null => {
  if (typeof window !== "undefined") {
    const Cookies = require("js-cookie");
    return Cookies.get("token") ?? null;
  }
  return null;
};

const getProfile = async (): Promise<ProfileResponse> => {
  let token = getToken();

  if (!token || token.trim() === "") {
    console.warn("⚠ Token ausente ou inválido.");
    return { user: null, doctor: null, patient: null, clinic: null };
  }

  try {
    const response = await fetch(`${BASE_URL}/auth/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (response.status === 401) {
      console.warn("⚠ Token expirado. Tentando renovar com refresh token...");
      const newToken = await refreshAccessToken();

      if (newToken) {
        console.log("✅ Token renovado com sucesso. Tentando novamente...");
        token = newToken;

        const newResponse = await fetch(`${BASE_URL}/auth/me`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!newResponse.ok) {
          console.warn("⚠ Falha na renovação da sessão. Realizando logout.");
          logout();
          return { user: null, doctor: null, patient: null, clinic: null };
        }

        const payload = await newResponse.json();
        const data = payload.data;

        const user = {
          id: data.id,
          email: data.email,
          role: data.role,
        };

        let doctor = null;
        if (data.role === "DOCTOR" && data.doctor?.id) {
          const doctorRes = await fetch(
            `${BASE_URL}/doctor/${data.doctor.id}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            },
          );
          const doctorPayload = await doctorRes.json();
          doctor = doctorPayload.data ?? null;
        }

        const clinic = data.clinic ?? null;

        return {
          user,
          doctor,
          patient: data.patient ?? null,
          clinic,
        };
      } else {
        console.warn(
          "⚠ Não foi possível renovar o token. Realizando logout automático.",
        );
        logout();
        return { user: null, doctor: null, patient: null, clinic: null };
      }
    }

    if (!response.ok) throw new Error("Erro ao obter perfil");

    const payload = await response.json();
    const data = payload.data;

    const user = {
      id: data.id,
      email: data.email,
      role: data.role,
    };

    let doctor = null;
    if (data.role === "DOCTOR" && data.doctor?.id) {
      const doctorRes = await fetch(`${BASE_URL}/doctor/${data.doctor.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const doctorPayload = await doctorRes.json();
      doctor = doctorPayload.data ?? null;
    }

    const clinic = data.clinic ?? null;

    return {
      user,
      doctor,
      patient: data.patient ?? null,
      clinic,
    };
  } catch (error: any) {
    console.error("❌ Erro ao obter perfil:", error.message);
    return { user: null, doctor: null, patient: null, clinic: null };
  }
};

const forgotPassword = async (email: string): Promise<void> => {
  try {
    const response = await fetch(`${BASE_URL}/auth/forgot-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message ?? "Erro ao solicitar recuperação de senha",
      );
    }
  } catch (error: any) {
    console.error("Erro ao solicitar recuperação de senha:", error.message);
    throw error;
  }
};

const validateToken = async (code: string): Promise<void> => {
  try {
    const response = await fetch(`${BASE_URL}/auth/validate-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message ?? "Erro ao validar o token");
    }
  } catch (error: any) {
    console.error("Erro ao validar token:", error.message);
    throw error;
  }
};

const resetPassword = async (
  code: string,
  newPassword: string,
  confirmPassword: string,
): Promise<void> => {
  try {
    const response = await fetch(`${BASE_URL}/auth/reset-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code, newPassword, confirmPassword }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message ?? "Erro ao redefinir a senha");
    }
  } catch (error: any) {
    console.error("Erro ao redefinir senha:", error.message);
    throw error;
  }
};

export {
  login,
  logout,
  getToken,
  getProfile,
  refreshAccessToken,
  forgotPassword,
  validateToken,
  resetPassword,
};
