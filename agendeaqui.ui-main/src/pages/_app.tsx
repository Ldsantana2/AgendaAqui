import "../globals.css";
import type { AppProps } from "next/app";
import { AuthProvider } from "../context/AuthContext";
import TopMenu from "../components/menu/TopMenu";
import MainLayout from "../components/layouts/MainLayout";
import { ConfigProvider } from "antd";
import locale from "antd/locale/pt_BR";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MessageProvider } from "../context/MessageContext";
import { AlertProvider } from "../context/AlertContext";
import Footer from "../components/menu/Footer";
import ErrorBoundary from "../components/error/ErrorBoundary";
import "antd/dist/reset.css";

const queryClient = new QueryClient({});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <MessageProvider>
          <AlertProvider>
            <>
              <TopMenu />
              <MainLayout>
                <ConfigProvider
                  locale={locale}
                  theme={{
                    token: {
                      colorPrimary: "rgb(13 148 136)",
                      colorPrimaryBgHover: "#0f766e",
                      colorLink: "#14b8a6",
                    },
                  }}
                >
                  <ErrorBoundary>
                    <Component {...pageProps} />
                  </ErrorBoundary>
                </ConfigProvider>
              </MainLayout>
            </>
            <Footer />
          </AlertProvider>
        </MessageProvider>
      </AuthProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default MyApp;
