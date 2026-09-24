# Sistema de Tratamento de Erros

Este documento descreve o sistema de tratamento de erros implementado no projeto AgendeAqui.

## Componentes

### 1. Páginas de Erro

- **404.tsx**: Página exibida quando uma rota não existe
- **500.tsx**: Página exibida quando ocorre um erro no servidor
- **error.tsx**: Página de erro personalizada que pode ser usada para diferentes tipos de erros

### 2. Componentes de Erro

- **ErrorPage.tsx**: Componente reutilizável que exibe uma mensagem de erro usando o componente Result do Ant Design
- **ErrorBoundary.tsx**: Componente que captura erros em componentes filhos e exibe uma UI de fallback
- **ErrorHandler.tsx**: Componente funcional alternativo para tratamento de erros (menos robusto que ErrorBoundary)

### 3. Utilitários

- **errorUtils.ts**: Funções utilitárias para redirecionamento para páginas de erro e tratamento de erros de API

## Como Usar

### Tratamento de Erros em Nível de Aplicação

O componente ErrorBoundary já está configurado no arquivo `_app.tsx` para capturar erros em toda a aplicação:

```tsx
<ErrorBoundary>
  <Component {...pageProps} />
</ErrorBoundary>
```

### Tratamento de Erros em Componentes Específicos

Para tratar erros em componentes específicos, você pode usar o componente ErrorBoundary:

```tsx
import ErrorBoundary from "../components/ErrorBoundary";

function MyComponent() {
  return (
    <ErrorBoundary>
      <ComponenteQuePoderiaFalhar />
    </ErrorBoundary>
  );
}
```

Ou usar o HOC withErrorBoundary:

```tsx
import { withErrorBoundary } from "../components/ErrorBoundary";

function MyComponent() {
  // Seu componente aqui
}

export default withErrorBoundary(MyComponent);
```

### Redirecionamento para Páginas de Erro

Para redirecionar para uma página de erro quando ocorre um problema:

```tsx
import { useRouter } from "next/navigation";
import { redirectToErrorPage } from "../utils/errorUtils";

function MyComponent() {
  const router = useRouter();
  
  const handleSomeAction = () => {
    try {
      // Alguma ação que pode falhar
    } catch (error) {
      redirectToErrorPage(router, "404", "Recurso não encontrado");
    }
  };
  
  return (
    // Seu componente aqui
  );
}
```

### Tratamento de Erros de API

Para tratar erros de API e redirecionar para a página de erro apropriada:

```tsx
import { useRouter } from "next/navigation";
import { handleApiError } from "../utils/errorUtils";

function MyComponent() {
  const router = useRouter();
  
  const fetchData = async () => {
    try {
      const response = await api.get("/some-endpoint");
      // Processar resposta
    } catch (error) {
      handleApiError(router, error);
    }
  };
  
  return (
    // Seu componente aqui
  );
}
```

## Tipos de Erro Suportados

- **404**: Página ou recurso não encontrado
- **403**: Acesso proibido
- **500**: Erro no servidor
- **error**: Erro genérico

## Personalização

O componente ErrorPage aceita as seguintes props para personalização:

```tsx
<ErrorPage
  status="404" // Tipo de erro: "404", "403", "500", "error", "info", "success", "warning"
  title="Título personalizado"
  subTitle="Mensagem de erro personalizada"
  buttonText="Texto do botão personalizado"
  redirectTo="/caminho-personalizado"
/>
```