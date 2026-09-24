import ErrorPage from "../components/error/ErrorPage";

export default function ServerErrorPage() {
  return (
    <ErrorPage
      status="500"
      title="500"
      subTitle="Desculpe, o servidor encontrou um erro."
      buttonText="Voltar para a página inicial"
      redirectTo="/"
    />
  );
}