"use client";

import {
  Button,
  Checkbox,
  DatePicker,
  Form,
  Input,
  Radio,
  Select,
  Space,
  message,
} from "antd";
import RegisterLayout from "../../components/layouts/RegisterLayout";
import { Controller, useForm } from "react-hook-form";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import dayjs from "dayjs";
import { RegisterUserFormData, registerPatientSchema } from "../../types/auth";
import { useRegisterUserMutation } from "../../services/auth.service";
import { createHealthPlan } from "../../services/healthplanService";
import { getHealthOperators } from "../../services/healthOperatorService";
import { getHealthPlanTypesByOperator } from "../../services/healthPlanTypeService";
import { format } from "@fnando/cpf";
import { useState, useEffect } from "react";

export default function PatientPage() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterUserFormData>({
    resolver: zodResolver(registerPatientSchema),
  });

  const registerMutation = useRegisterUserMutation();
  const [showHealthPlanFields, setShowHealthPlanFields] = useState<
    boolean | null
  >(null);

  const [healthOperatorId, setHealthOperatorId] = useState<string | null>(null);
  const [healthPlanTypeId, setHealthPlanTypeId] = useState<string | null>(null);
  const [cardNumber, setCardNumber] = useState<string>("");
  const [validUntil, setValidUntil] = useState<Date | null>(null);

  const [healthOperatorOptions, setHealthOperatorOptions] = useState<any[]>([]);
  const [healthPlanTypeOptions, setHealthPlanTypeOptions] = useState<any[]>([]);

  useEffect(() => {
    const fetchOperators = async () => {
      try {
        const operators = await getHealthOperators();
        setHealthOperatorOptions(operators);
      } catch (error) {
        message.error("Erro ao buscar operadoras de saúde.");
      }
    };
    fetchOperators();
  }, []);

  useEffect(() => {
    const fetchPlans = async () => {
      if (!healthOperatorId) return;
      try {
        const response = await getHealthPlanTypesByOperator(healthOperatorId);

        // ✅ Filter only "Ativo"
        const activePlans = (response.data || []).filter(
          (plan: any) => plan.situation === "Ativo",
        );

        setHealthPlanTypeOptions(activePlans);
      } catch (error) {
        message.error("Erro ao buscar tipos de plano.");
      }
    };
    fetchPlans();
  }, [healthOperatorId]);

  const onSubmit = async (data: RegisterUserFormData) => {
    try {
      // ✅ 1. Registra o usuário (e paciente) no backend
      await registerMutation.mutateAsync(data);

      // ✅ 2. Se não for cadastrar plano, exibe aviso e encerra
      if (!showHealthPlanFields) {
        message.warning(
          "Cadastrar o plano será obrigatório para marcação de consultas com o convênio!",
        );
        return;
      }

      // ✅ 3. Verifica se os campos do plano foram preenchidos
      if (!healthOperatorId || !healthPlanTypeId || !validUntil) {
        message.error("Preencha todas as informações do plano de saúde.");
        return;
      }

      // ✅ 4. Busca o ID do paciente via email (já que não temos login)
      const response = await fetch(
        `https://agendeaqui-api-auth.onrender.com/api/patient/email/${data.email}`,
      );
      const json = await response.json();
      const patientId = json?.data?.id;

      if (!patientId) {
        message.error(
          "Não foi possível obter o ID do paciente após o cadastro.",
        );
        return;
      }

      // ✅ 5. Cadastra o plano de saúde
      await createHealthPlan({
        healthOperatorId,
        healthPlanTypeId,
        number: cardNumber,
        validUntil: validUntil.toISOString(),
        patientId,
      });

      message.success("Cadastro completo com plano de saúde!");
    } catch (error) {
      console.error("Erro no cadastro completo:", error);
      message.error("Erro ao cadastrar paciente.");
    }
  };

  return (
    <RegisterLayout>
      <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
        <style jsx global>{`
          /* Inputs, Selects, DatePickers */
          .ant-input,
          .ant-input-affix-wrapper,
          .ant-select-selector,
          .ant-picker {
            border-color: #2d39a6 !important;
          }
          .ant-input:focus,
          .ant-input-affix-wrapper:focus,
          .ant-select-focused .ant-select-selector,
          .ant-picker-focused {
            border-color: #2d39a6 !important;
            box-shadow: 0 0 0 2px rgba(45, 57, 166, 0.3) !important;
          }

          /* Checkbox */
          .ant-checkbox-inner {
            border-color: #2d39a6 !important;
          }
          .ant-checkbox-checked .ant-checkbox-inner {
            background-color: #2d39a6 !important;
            border-color: #2d39a6 !important;
          }
          .ant-checkbox-checked .ant-checkbox-inner::after {
            border-color: white !important;
          }

          /* Radio */
          .ant-radio-inner {
            border-color: #2d39a6 !important;
          }
          .ant-radio-checked .ant-radio-inner {
            background-color: #2d39a6 !important;
            border-color: #2d39a6 !important;
          }
          .ant-radio-inner::after {
            background-color: #2d39a6 !important;
          }

          /* Botão Voltar (Link) */
          a.back-link {
            color: #2d39a6 !important;
            font-weight: 600;
            text-decoration: none;
          }
          a.back-link:hover {
            text-decoration: underline;
            color: #283277 !important;
          }
        `}</style>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Form.Item
            label="Nome"
            validateStatus={errors.name ? "error" : ""}
            help={errors.name?.message}
          >
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  className="h-9 !border-[#2D39A6] !ring-[#2D39A6]"
                />
              )}
            />
          </Form.Item>

          <Form.Item
            label="Sobrenome"
            validateStatus={errors.surname ? "error" : ""}
            help={errors.surname?.message}
          >
            <Controller
              name="surname"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  className="h-9 !border-[#2D39A6] !ring-[#2D39A6]"
                />
              )}
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
                <Input
                  {...field}
                  type="email"
                  className="h-9 !border-[#2D39A6] !ring-[#2D39A6]"
                />
              )}
            />
          </Form.Item>

          <Form.Item
            label="Telefone"
            validateStatus={errors.phone ? "error" : ""}
            help={errors.phone?.message}
          >
            <Controller
              name="phone"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  className="h-9 !border-[#2D39A6] !ring-[#2D39A6]"
                />
              )}
            />
          </Form.Item>

          <Form.Item
            label="CPF"
            validateStatus={errors.cpf ? "error" : ""}
            help={errors.cpf?.message}
          >
            <Controller
              name="cpf"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  className="h-9 !border-[#2D39A6] !ring-[#2D39A6]"
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
                <Input.Password
                  {...field}
                  className="h-9 !border-[#2D39A6] !ring-[#2D39A6]"
                />
              )}
            />
          </Form.Item>

          <Form.Item
            label="Confirmação de senha"
            validateStatus={errors.passwordConfirmation ? "error" : ""}
            help={errors.passwordConfirmation?.message}
            className="h-9"
          >
            <Controller
              name="passwordConfirmation"
              control={control}
              render={({ field }) => (
                <Input.Password
                  {...field}
                  className="h-9 !border-[#2D39A6] !ring-[#2D39A6]"
                />
              )}
            />
          </Form.Item>

          <Form.Item
            label="Data de nascimento"
            validateStatus={errors.birthDay ? "error" : ""}
            help={errors.birthDay?.message}
          >
            <Controller
              name="birthDay"
              control={control}
              render={({ field }) => (
                <DatePicker
                  {...field}
                  value={field.value ? dayjs(field.value) : null}
                  onChange={(date) => field.onChange(date?.toDate())}
                  format="DD/MM/YYYY"
                  className="h-9 !border-[#2D39A6] !ring-[#2D39A6]"
                />
              )}
            />
          </Form.Item>

          <Form.Item
            label="Gênero"
            validateStatus={errors.gender ? "error" : ""}
            help={errors.gender?.message}
          >
            <Controller
              name="gender"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  className="h-9 !border-[#2D39A6] !ring-[#2D39A6]"
                >
                  <Select.Option value="male">Homem</Select.Option>
                  <Select.Option value="female">Mulher</Select.Option>
                  <Select.Option value="other">Outro</Select.Option>
                </Select>
              )}
            />
          </Form.Item>

          <Form.Item label="Gostaria de cadastrar seu plano de saúde?">
            <Radio.Group
              value={showHealthPlanFields}
              onChange={(e) => {
                setShowHealthPlanFields(e.target.value);
                if (!e.target.value) {
                  setHealthOperatorId(null);
                  setHealthPlanTypeId(null);
                  setCardNumber("");
                  setValidUntil(null);
                }
              }}
            >
              <Radio
                value={true}
                className="!text-[#2D39A6]"
                style={{ borderColor: "#2D39A6" }}
              >
                Sim
              </Radio>
              <Radio
                value={false}
                className="!text-[#2D39A6]"
                style={{ borderColor: "#2D39A6" }}
              >
                Não
              </Radio>
            </Radio.Group>
          </Form.Item>

          {showHealthPlanFields && (
            <>
              <Form.Item label="Operadora do Plano">
                <Select
                  showSearch
                  value={healthOperatorId}
                  onChange={(value) => {
                    setHealthOperatorId(value);
                    setHealthPlanTypeId(null);
                  }}
                  placeholder="Selecione uma operadora"
                  filterOption={(input, option) => {
                    const normalize = (str: string) =>
                      str
                        .normalize("NFD")
                        .replace(/[\u0300-\u036f]/g, "")
                        .toLowerCase();

                    return normalize(option?.label ?? "").includes(
                      normalize(input),
                    );
                  }}
                  options={healthOperatorOptions
                    .sort((a, b) =>
                      a.operatorCompanyName.localeCompare(
                        b.operatorCompanyName,
                      ),
                    )
                    .map((op) => ({
                      value: op.id,
                      label: op.operatorCompanyName,
                    }))}
                  className="!border-[#2D39A6] !ring-[#2D39A6]"
                />
              </Form.Item>

              <Form.Item label="Tipo de Plano">
                <Select
                  showSearch
                  value={healthPlanTypeId}
                  onChange={setHealthPlanTypeId}
                  placeholder="Selecione um tipo de plano"
                  filterOption={(input, option) => {
                    const normalize = (str: string) =>
                      str
                        .normalize("NFD")
                        .replace(/[\u0300-\u036f]/g, "")
                        .toLowerCase();

                    return normalize(option?.label ?? "").includes(
                      normalize(input),
                    );
                  }}
                  options={healthPlanTypeOptions
                    .sort((a, b) => a.planName.localeCompare(b.planName))
                    .map((plan) => ({
                      value: plan.id,
                      label: plan.planName,
                    }))}
                  className="!border-[#2D39A6] !ring-[#2D39A6]"
                />
              </Form.Item>

              <Form.Item label="Número da Carteirinha">
                <Input
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="!border-[#2D39A6] !ring-[#2D39A6]"
                />
              </Form.Item>

              <Form.Item label="Data de Validade">
                <DatePicker
                  value={validUntil ? dayjs(validUntil) : null}
                  onChange={(date) => setValidUntil(date?.toDate() || null)}
                  format="DD/MM/YYYY"
                  className="!border-[#2D39A6] !ring-[#2D39A6]"
                />
              </Form.Item>
            </>
          )}
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
                className="!border-[#2D39A6] !ring-[#2D39A6]"
              />
            )}
          />
          <Link
            href="https://www.google.com"
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
            className="w-full bg-[#2D39A6] hover:!bg-[#283277] text-white border-none"
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
