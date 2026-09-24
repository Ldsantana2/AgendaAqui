import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

type ErrorType = "404" | "403" | "500" | "error";

/**
 * Redirects to the error page with the specified error type and message
 * @param router Next.js router instance
 * @param type Type of error (404, 403, 500, or generic error)
 * @param message Custom error message (optional)
 */
export function redirectToErrorPage(
  router: AppRouterInstance,
  type: ErrorType = "error",
  message?: string
): void {
  const params = new URLSearchParams();
  params.append("type", type);
  
  if (message) {
    params.append("message", message);
  }
  
  router.push(`/error?${params.toString()}`);
}

/**
 * Handles API errors and redirects to the appropriate error page
 * @param router Next.js router instance
 * @param error Error object or response
 */
export function handleApiError(
  router: AppRouterInstance,
  error: any
): void {
  // Default error type and message
  let errorType: ErrorType = "error";
  let errorMessage = "Ocorreu um erro ao processar sua solicitação.";

  // Check if error has status code
  if (error.response) {
    const status = error.response.status;
    
    if (status === 404) {
      errorType = "404";
      errorMessage = "O recurso solicitado não foi encontrado.";
    } else if (status === 403 || status === 401) {
      errorType = "403";
      errorMessage = "Você não tem permissão para acessar este recurso.";
    } else if (status >= 500) {
      errorType = "500";
      errorMessage = "Ocorreu um erro no servidor. Tente novamente mais tarde.";
    }
    
    // Use error message from response if available
    if (error.response.data && error.response.data.message) {
      errorMessage = error.response.data.message;
    }
  } else if (error.message) {
    errorMessage = error.message;
  }
  
  redirectToErrorPage(router, errorType, errorMessage);
}