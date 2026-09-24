import ErrorPage from "../components/error/ErrorPage";

export default function NotFoundPage() {
  return (
    <ErrorPage
      status="404"
      title="404"
      subTitle="Desculpe, a página que você está procurando não existe."
      buttonText="Voltar para a página inicial"
      redirectTo="/"
    />
  );
}
