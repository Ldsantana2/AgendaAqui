import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import ErrorPage from "../components/error/ErrorPage";

type ErrorType = "404" | "403" | "500" | "error";

export default function CustomErrorPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [errorType, setErrorType] = useState<ErrorType>("error");
  const [errorMessage, setErrorMessage] = useState<string>("Ocorreu um erro.");

  useEffect(() => {
    const type = searchParams.get("type") as ErrorType;
    const message = searchParams.get("message");

    if (type && ["404", "403", "500", "error"].includes(type)) {
      setErrorType(type);
    }

    if (message) {
      setErrorMessage(message);
    } else {
      // Default messages based on error type
      switch (type) {
        case "404":
          setErrorMessage("A página ou recurso que você está procurando não existe.");
          break;
        case "403":
          setErrorMessage("Você não tem permissão para acessar este recurso.");
          break;
        case "500":
          setErrorMessage("Ocorreu um erro no servidor. Tente novamente mais tarde.");
          break;
        default:
          setErrorMessage("Ocorreu um erro ao processar sua solicitação.");
      }
    }
  }, [searchParams]);

  return (
    <ErrorPage
      status={errorType}
      title={errorType === "error" ? "Erro" : errorType}
      subTitle={errorMessage}
      buttonText="Voltar para a página inicial"
      redirectTo="/"
    />
  );
}