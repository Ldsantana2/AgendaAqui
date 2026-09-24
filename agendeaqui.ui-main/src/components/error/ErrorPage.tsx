import { Button, Result } from "antd";
import { useRouter } from "next/navigation";

type ErrorPageProps = {
  status?: "404" | "403" | "500" | "info" | "success" | "warning" | "error";
  title?: string;
  subTitle?: string;
  buttonText?: string;
  redirectTo?: string;
};

export default function ErrorPage({
  status = "error",
  title = "Erro",
  subTitle = "Desculpe, ocorreu um erro ao carregar esta página.",
  buttonText = "Voltar para a página inicial",
  redirectTo = "/",
}: ErrorPageProps) {
  const router = useRouter();

  return (
    <div className="flex justify-center items-center min-h-[70vh]">
      <Result
        status={status}
        title={title}
        subTitle={subTitle}
        extra={
          <Button type="primary" onClick={() => router.push(redirectTo)}>
            {buttonText}
          </Button>
        }
      />
    </div>
  );
}