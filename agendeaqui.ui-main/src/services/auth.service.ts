import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/router";
import api from "./api";
import {
  RegisterClinicFormData,
  RegisterUserFormData,
} from "../types/auth";
import { useMessage } from "../context/MessageContext";

export const useRegisterUserMutation = () => {
  const messageApi = useMessage();
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: RegisterUserFormData) => {
      const response = await api.post("/auth/register", data);
      return response.data;
    },
    onSuccess: (data) => {
      messageApi.success("Cadastro realizado com sucesso!");
      router.push("/login");
    },
    onError: (error: any) => {
      messageApi.error(
        error.response?.data?.message ||
          "Erro ao cadastrar usuário. Tente novamente.",
      );
    },
  });
};

export const useRegisterClinicMutation = () => {
  const messageApi = useMessage();
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: RegisterClinicFormData) => {
      const response = await api.post("/auth/register-clinic", data);
      return response.data;
    },
    onSuccess: (data) => {
      messageApi.success("Cadastro realizado com sucesso!");
      router.push("/login");
    },
    onError: (error: any) => {
      messageApi.error(
        error.response?.data?.message ||
          "Erro ao cadastrar usuário. Tente novamente.",
      );
    },
  });
};
