"use client";

import { Button, Checkbox, Form, Input, Space } from "antd";
import RegisterLayout from "../../components/layouts/RegisterLayout";
import { Controller, useForm } from "react-hook-form";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterClinicFormData, registerClinicSchema } from "../../types/auth";
import { useRegisterClinicMutation } from "../../services/auth.service";
import { format } from "@fnando/cnpj";

export default function ClinicaPage() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterClinicFormData>({
    resolver: zodResolver(registerClinicSchema),
    defaultValues: {
      address: {
        street: "",
        number: "",
        city: "",
        state: "",
        zipCode: "",
      },
    },
  });

  const registerMutation = useRegisterClinicMutation();

  const onSubmit = (data: RegisterClinicFormData) => {
    registerMutation.mutate(data);
  };

  return (
    <RegisterLayout>
      <style>{`
        /* Forçar borda e sombra azul no foco dos inputs, selects, datepickers e inputs com ícone */
        .ant-input:focus,
        .ant-input-affix-wrapper-focused,
        .ant-select-focused,
        .ant-picker-focused,
        .ant-input-password-focused {
          border-color: #2D39A6 !important;
          box-shadow: 0 0 0 2px rgba(45, 57, 166, 0.2) !important;
        }

        /* Checkbox: borda e sombra azul ao focar */
        .ant-checkbox-input:focus + .ant-checkbox-inner {
          border-color: #2D39A6 !important;
          box-shadow: 0 0 0 2px rgba(45, 57, 166, 0.2) !important;
        }

        /* Checkbox marcado com fundo azul */
        .ant-checkbox-checked .ant-checkbox-inner {
          background-color: #2D39A6 !important;
          border-color: #2D39A6 !important;
        }

        /* Botão Cadastrar: força hover com cor #283277 */
        .register-submit-btn:hover, 
        .register-submit-btn:focus {
          background-color: #283277 !important;
          border-color: #283277 !important;
          color: #fff !important;
        }
      `}</style>

      <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* ... seus Form.Items e Controllers ... */}
          <Form.Item
            label="Nome da clinica"
            validateStatus={errors.name ? "error" : ""}
            help={errors.name?.message}
          >
            <Controller
              name="name"
              control={control}
              render={({ field }) => <Input className="h-9" {...field} />}
            />
          </Form.Item>

          <Form.Item
            label="Nome do responsavel"
            validateStatus={errors.responsibleName ? "error" : ""}
            help={errors.responsibleName?.message}
          >
            <Controller
              name="responsibleName"
              control={control}
              render={({ field }) => <Input className="h-9" {...field} />}
            />
          </Form.Item>

          <Form.Item
            label="E-mail"
            validateStatus={errors.email ? "error" : ""}
            help={errors.email?.message}
          >
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <Input className="h-9" type="email" {...field} />
              )}
            />
          </Form.Item>

          <Form.Item
            label="CNPJ"
            validateStatus={errors.cnpj ? "error" : ""}
            help={errors.cnpj?.message}
          >
            <Controller
              name="cnpj"
              control={control}
              render={({ field }) => (
                <Input
                  className="h-9"
                  {...field}
                  onChange={(e) => {
                    const formatted = format(e.target.value);
                    e.target.value = formatted;
                    field.onChange(formatted);
                  }}
                />
              )}
            />
          </Form.Item>

          <Form.Item
            label="Senha"
            validateStatus={errors.password ? "error" : ""}
            help={errors.password?.message}
          >
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <Input.Password className="h-9" {...field} />
              )}
            />
          </Form.Item>

          <Form.Item
            label="Confirmação de senha"
            validateStatus={errors.passwordConfirmation ? "error" : ""}
            help={errors.passwordConfirmation?.message}
            className="relative"
          >
            <Controller
              name="passwordConfirmation"
              control={control}
              render={({ field }) => (
                <Input.Password className="h-9" {...field} />
              )}
            />
          </Form.Item>

          <Form.Item
            label="Rua"
            validateStatus={errors.address?.street ? "error" : ""}
            help={errors.address?.street?.message}
          >
            <Controller
              name="address.street"
              control={control}
              render={({ field }) => <Input className="h-9" {...field} />}
            />
          </Form.Item>

          <Form.Item
            label="Número"
            validateStatus={errors.address?.number ? "error" : ""}
            help={errors.address?.number?.message}
          >
            <Controller
              name="address.number"
              control={control}
              render={({ field }) => <Input className="h-9" {...field} />}
            />
          </Form.Item>

          <Form.Item
            label="Cidade"
            validateStatus={errors.address?.city ? "error" : ""}
            help={errors.address?.city?.message}
          >
            <Controller
              name="address.city"
              control={control}
              render={({ field }) => <Input className="h-9" {...field} />}
            />
          </Form.Item>

          <Form.Item
            label="Estado"
            validateStatus={errors.address?.state ? "error" : ""}
            help={errors.address?.state?.message}
          >
            <Controller
              name="address.state"
              control={control}
              render={({ field }) => <Input className="h-9" {...field} />}
            />
          </Form.Item>

          <Form.Item
            label="CEP"
            validateStatus={errors.address?.zipCode ? "error" : ""}
            help={errors.address?.zipCode?.message}
          >
            <Controller
              name="address.zipCode"
              control={control}
              render={({ field }) => <Input className="h-9" {...field} />}
            />
          </Form.Item>

          <Form.Item
            label="Complemento"
            validateStatus={errors.address?.complement ? "error" : ""}
            help={errors.address?.complement?.message}
          >
            <Controller
              name="address.complement"
              control={control}
              render={({ field }) => <Input className="h-9" {...field} />}
            />
          </Form.Item>
        </div>

        <Form.Item
          validateStatus={errors.isTermsAndConditionsAccepted ? "error" : ""}
          help={errors.isTermsAndConditionsAccepted?.message}
        >
          <Controller
            name="isTermsAndConditionsAccepted"
            control={control}
            render={({ field }) => (
              <Checkbox
                {...field}
                checked={field.value}
                onChange={(e) => field.onChange(e.target.checked)}
              />
            )}
          />
          <Link
            href={"https://www.google.com"}
            className="text-sm text-gray-700 ml-2"
          >
            Aceito os termos e condições
          </Link>
        </Form.Item>

        <Space direction="vertical" className="w-full mt-6">
          <Button
            type="primary"
            htmlType="submit"
            loading={registerMutation.isPending}
            className="w-full bg-[#2D39A6] hover:bg-[#283277] register-submit-btn"
          >
            {registerMutation.isPending ? "Cadastrando..." : "Cadastrar"}
          </Button>

          <Link
            href="/login"
            className="block text-center text-[#2D39A6] hover:underline"
          >
            Já tem uma conta? Faça o login
          </Link>
        </Space>
      </Form>
    </RegisterLayout>
  );
}
