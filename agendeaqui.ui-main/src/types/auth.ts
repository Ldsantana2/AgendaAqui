import { z } from "zod";
import * as cpf from "@fnando/cpf";
import * as cnpj from "@fnando/cnpj";
export const registerPatientSchema = z
  .object({
    name: z
      .string({ message: "O nome é obrigatorio" })
      .min(1, "O nome Precisa ter mais de uma letra"),
    surname: z.string({ message: "O sobrenome é obrigatório" }).min(1, ""),
    email: z
      .string({ message: "O e-mail é obrigatório" })
      .email("Email inválido"),
    cpf: z
      .string({ message: "CPF é obrigatorio" })
      .refine((value) => cpf.isValid(value), {
        message: "CPF informado não é valido",
      })
      .transform((value) => cpf.strip(value)),
    password: z
      .string({ message: "A senha é obrigatória" })
      .min(8, "A senha precisa no minimo de 8 caracteres"),
    passwordConfirmation: z
      .string({
        message: "É obrigatorio confirmar a senha",
      })
      .min(1, "A confirmação de senha é obrigatória"),
    phone: z.string({ message: "Telefone é obrigatório" }),
    birthDay: z
      .date({ message: "Data de nascimento é obrigatoria" })
      .optional(),
    gender: z.enum(["male", "female", "other"]).optional(),
    isTermsAndConditionsAccepted: z.boolean(),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "As senhas não coincidem",
    path: ["passwordConfirmation"],
  });

export const registerClinicSchema = z
  .object({
    name: z
      .string({ message: "O nome da clinica é obrigatorio" })
      .min(1, "O nome Precisa ter mais de uma letra"),
    responsibleName: z
      .string({ message: "O nome é obrigatorio" })
      .min(1, "O nome Precisa ter mais de uma letra"),
    email: z
      .string({ message: "O e-mail é obrigatório" })
      .email("Email inválido"),
    cnpj: z
      .string({ message: "cnpj é obrigatorio" })
      .refine((value) => cnpj.isValid(value), {
        message: "cnpj informado não é valido",
      })
      .transform((value) => cnpj.strip(value)),
    password: z
      .string({ message: "A senha é obrigatória" })
      .min(8, "A senha precisa no minimo de 8 caracteres"),
    passwordConfirmation: z
      .string({
        message: "É obrigatorio confirmar a senha",
      })
      .min(1, "A confirmação de senha é obrigatória"),
    address: z.object({
      street: z.string({ message: "Rua é obrigatória" }),
      number: z.string({ message: "Número é obrigatório" }).min(1),
      city: z.string({ message: "Cidade é obrigatória" }),
      state: z.string({ message: "Estado é obrigatório" }),
      zipCode: z.string({ message: "CEP é obrigatório" }),
      complement: z.string().optional(),
      addressName: z.string().default("Casa"),
      location: z
        .object({
          latitude: z.string(),
          longitude: z.string(),
        })
        .optional(),
    }),
    isTermsAndConditionsAccepted: z.boolean(),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "As senhas não coincidem",
    path: ["passwordConfirmation"],
  });

export type RegisterUserFormData = z.infer<typeof registerPatientSchema>;
export type RegisterClinicFormData = z.infer<typeof registerClinicSchema>;
