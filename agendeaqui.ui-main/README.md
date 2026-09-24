# AgendeAqui - Interface Web

## Visão Geral

Este projeto é uma aplicação **Next.js** com **React 19** e **TypeScript** que fornece a interface web do sistema AgendeAqui. O layout utiliza **Ant Design** e **Tailwind CSS** para os componentes visuais.

## Bibliotecas Principais

- **Next.js 15** – framework para React com renderização híbrida.
- **React 19** – biblioteca de interface.
- **TypeScript** – tipagem estática para JavaScript.
- **Ant Design** – conjunto de componentes de UI.
- **Tailwind CSS** – utilitários de estilização.
- **React Query** – gerenciamento de estados assíncronos.
- **React Hook Form** e **Zod** – construção e validação de formulários.
- **Axios** – requisições HTTP.
- **Headless UI** – componentes acessíveis sem estilo.
- **dayjs** / **moment** e **date-fns** – manipulação de datas.
- **js-cookie** – gerenciamento de cookies.
- **@fnando/cpf** e **@fnando/cnpj** – utilidades para documentos brasileiros.

Consulte `package.json` para a lista completa de dependências.

## Requisitos

- Node.js 18 ou superior
- npm

## Como rodar o projeto

1. Instale as dependências:
   ```bash
   npm install
   ```
2. Inicie em modo de desenvolvimento:
   ```bash
   npm run dev
   ```
   A aplicação ficará disponível em `http://localhost:3000/login`.

Para gerar uma build de produção:
```bash
npm run build
npm start
```

## Scripts úteis

- `npm run lint` – executa o ESLint.

## Estrutura

- `src/pages/` – páginas da aplicação.
- `src/components/` – componentes reutilizáveis.
- `src/context/` – provedores de estado global.
- `src/docs/` – documentação extra (veja `src/docs/error-handling.md`).

## Sugestões

- Crie um arquivo `.env` para armazenar URLs de APIs e chaves.
- Considere integrar testes automatizados com Jest e React Testing Library.
- Personalize o tema do Ant Design no arquivo `_app.tsx` e ajuste o Tailwind em `tailwind.config.mjs`.

