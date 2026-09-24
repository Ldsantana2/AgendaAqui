"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  FaCreditCard,
  FaBarcode,
  FaQrcode,
  FaTag,
  FaArrowLeft,
} from "react-icons/fa";
import Link from "next/link";
import LoadingOverlay from "../components/LoadingOverlay"; // 👈 NOVO: Importe o componente

// Define plan types
interface PlanDetails {
  id: string;
  name: string;
  price: number;
  description: string;
  features: string[];
}

// Plan data
const plansData: Record<string, PlanDetails> = {
  starter: {
    id: "starter",
    name: "Starter",
    price: 99,
    description: "Ideal para profissionais autônomos",
    features: [
      "Até 50 agendamentos por mês",
      "Perfil profissional básico",
      "Lembretes por e-mail",
      "Suporte por e-mail",
    ],
  },
  plus: {
    id: "plus",
    name: "Plus",
    price: 199,
    description: "Perfeito para clínicas em crescimento",
    features: [
      "Até 200 agendamentos por mês",
      "Perfil profissional destacado",
      "Lembretes por e-mail e SMS",
      "Suporte prioritário",
      "Relatórios mensais",
      "Integração com Google Calendar",
    ],
  },
  vip: {
    id: "vip",
    name: "VIP",
    price: 349,
    description: "Para clínicas de grande porte",
    features: [
      "Agendamentos ilimitados",
      "Perfil profissional premium",
      "Lembretes personalizados",
      "Suporte VIP 24/7",
      "Relatórios avançados",
      "API para integrações",
      "Múltiplos profissionais",
    ],
  },
};

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedPlan, setSelectedPlan] = useState<PlanDetails | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string>("credit");
  const [couponCode, setCouponCode] = useState<string>("");
  const [discount, setDiscount] = useState<number>(0);
  const [isValidCoupon, setIsValidCoupon] = useState<boolean | null>(null);

  useEffect(() => {
    const planId = searchParams.get("plan");
    if (planId && plansData[planId]) {
      setSelectedPlan(plansData[planId]);
    } else {
      // Redirect back to plans page if no valid plan is selected
      router.push("/plans");
    }
  }, [searchParams, router]);

  const handleCouponApply = () => {
    // This is a mock implementation. In a real app, you would validate the coupon with an API call
    if (couponCode.toLowerCase() === "desconto10") {
      setDiscount(10);
      setIsValidCoupon(true);
    } else if (couponCode.toLowerCase() === "desconto20") {
      setDiscount(20);
      setIsValidCoupon(true);
    } else {
      setDiscount(0);
      setIsValidCoupon(false);
    }
  };

  const calculateTotal = () => {
    if (!selectedPlan) return 0;
    return selectedPlan.price * (1 - discount / 100);
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would integrate with a payment gateway
    alert(`Pagamento processado com sucesso! Método: ${paymentMethod}`);
    // Redirect to success page or dashboard
    router.push("/dashboard");
  };

  if (!selectedPlan) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col">
        <LoadingOverlay />

        <p className="mt-4 text-gray-600">Carregando detalhes do plano...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link
            href="/plans"
            className="inline-flex items-center text-[#2D39A6] hover:text-[#283277]"
          >
            <FaArrowLeft className="mr-2" /> Voltar para planos
          </Link>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            <span className="text-[#2D39A6]">Finalizar Assinatura</span>
          </h1>
          <p className="mt-4 text-xl text-gray-600">
            Revise os detalhes e escolha sua forma de pagamento
          </p>
        </div>

        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800">
              Resumo do Plano
            </h2>
            <div className="mt-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-semibold text-[#2D39A6]">
                    {selectedPlan.name}
                  </h3>
                  <p className="text-gray-600">{selectedPlan.description}</p>
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  R${selectedPlan.price}/mês
                </div>
              </div>

              <div className="mt-4">
                <h4 className="font-medium text-gray-700">
                  Recursos incluídos:
                </h4>
                <ul className="mt-2 space-y-2">
                  {selectedPlan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-[#2D39A6] mr-2">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <form onSubmit={handlePaymentSubmit} className="p-6">
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Forma de Pagamento
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("credit")}
                  className={`p-4 border rounded-lg flex flex-col items-center justify-center transition-colors ${
                    paymentMethod === "credit"
                      ? "border-[#283277] bg-[#2D39A6]"
                      : "border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <FaCreditCard className="text-2xl mb-2 text-[#2D39A6]" />
                  <span className="font-medium">Cartão de Crédito</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod("pix")}
                  className={`p-4 border rounded-lg flex flex-col items-center justify-center transition-colors ${
                    paymentMethod === "pix"
                      ? "border-[#283277] bg-[#2D39A6]"
                      : "border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <FaQrcode className="text-2xl mb-2 text-[#2D39A6]" />
                  <span className="font-medium">PIX</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod("boleto")}
                  className={`p-4 border rounded-lg flex flex-col items-center justify-center transition-colors ${
                    paymentMethod === "boleto"
                      ? "border-[#283277] bg-[#2D39A6]"
                      : "border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <FaBarcode className="text-2xl mb-2 text-[#2D39A6]" />
                  <span className="font-medium">Boleto Bancário</span>
                </button>
              </div>
            </div>

            {/* Payment method specific forms would go here */}
            {paymentMethod === "credit" && (
              <div className="mb-6 space-y-4">
                <div>
                  <label
                    htmlFor="cardNumber"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Número do Cartão
                  </label>
                  <input
                    type="text"
                    id="cardNumber"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="1234 5678 9012 3456"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="expiry"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Data de Validade
                    </label>
                    <input
                      type="text"
                      id="expiry"
                      className="w-full p-2 border border-gray-300 rounded-md"
                      placeholder="MM/AA"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="cvv"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      CVV
                    </label>
                    <input
                      type="text"
                      id="cvv"
                      className="w-full p-2 border border-gray-300 rounded-md"
                      placeholder="123"
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="cardName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Nome no Cartão
                  </label>
                  <input
                    type="text"
                    id="cardName"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="Nome como aparece no cartão"
                  />
                </div>
              </div>
            )}

            {paymentMethod === "pix" && (
              <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50 text-center">
                <p className="text-gray-700 mb-4">
                  Ao finalizar, você receberá um QR Code para pagamento via PIX.
                </p>
                <div className="w-48 h-48 mx-auto bg-gray-200 flex items-center justify-center">
                  <FaQrcode className="text-6xl text-gray-400" />
                </div>
              </div>
            )}

            {paymentMethod === "boleto" && (
              <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
                <p className="text-gray-700 mb-4">
                  Ao finalizar, você receberá um boleto bancário para pagamento.
                </p>
                <p className="text-sm text-gray-500">
                  O boleto tem vencimento em 3 dias úteis. Sua assinatura será
                  ativada após a confirmação do pagamento.
                </p>
              </div>
            )}

            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Cupom de Desconto
              </h3>
              <div className="flex">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="flex-grow p-2 border border-gray-300 rounded-l-md"
                  placeholder="Digite seu cupom"
                />
                <button
                  type="button"
                  onClick={handleCouponApply}
                  className="bg-[#2D39A6] text-white px-4 py-2 rounded-r-md hover:bg-[#283277] transition-colors"
                >
                  Aplicar
                </button>
              </div>
              {isValidCoupon === true && (
                <p className="mt-2 text-green-600 text-sm">
                  Cupom aplicado! Desconto de {discount}% no valor total.
                </p>
              )}
              {isValidCoupon === false && (
                <p className="mt-2 text-red-600 text-sm">
                  Cupom inválido ou expirado.
                </p>
              )}
            </div>

            <div className="border-t border-gray-200 pt-4 mb-6">
              <div className="flex justify-between items-center text-lg font-medium">
                <span>Total:</span>
                <span className="text-2xl font-bold text-[#2D39A6]">
                  R${calculateTotal().toFixed(2)}/mês
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Cobrança mensal. Você pode cancelar a qualquer momento.
              </p>
            </div>

            <div className="text-center">
              <button
                type="submit"
                className="w-full md:w-auto bg-[#2D39A6] text-white py-3 px-8 rounded-md hover:bg-[#283277] focus:outline-none focus:ring-2 focus:ring-[#2D39A6] focus:ring-offset-2 transition-colors duration-200 text-lg font-medium"
              >
                Finalizar Assinatura
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
