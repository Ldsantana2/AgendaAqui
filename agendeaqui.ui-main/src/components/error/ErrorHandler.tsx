import { ReactNode, useState } from "react";
import ErrorPage from "./ErrorPage";

type ErrorHandlerProps = {
  children: ReactNode;
  fallback?: ReactNode;
};

export default function ErrorHandler({ 
  children, 
  fallback 
}: ErrorHandlerProps) {
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  if (hasError) {
    return fallback ? (
      <>{fallback}</>
    ) : (
      <ErrorPage 
        status="error" 
        title="Erro ao carregar" 
        subTitle={error?.message || "Ocorreu um erro ao carregar esta página."} 
      />
    );
  }

  try {
    return <>{children}</>;
  } catch (err) {
    if (err instanceof Error) {
      setError(err);
    }
    setHasError(true);
    return fallback ? (
      <>{fallback}</>
    ) : (
      <ErrorPage 
        status="error" 
        title="Erro ao carregar" 
        subTitle={(err as Error)?.message || "Ocorreu um erro ao carregar esta página."} 
      />
    );
  }
}

// HOC (Higher Order Component) for wrapping pages with error handling
export function withErrorHandling<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: ReactNode
) {
  return function WithErrorHandling(props: P) {
    return (
      <ErrorHandler fallback={fallback}>
        <Component {...props} />
      </ErrorHandler>
    );
  };
}