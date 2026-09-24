import "./globals.css";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import "@ant-design/v5-patch-for-react-19";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import Head from "next/head";

dayjs.locale("pt-br");
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt">
      <Head>
        <title>Agendaqui Saúde - Agendamente rapido e pratico</title>
      </Head>
      <body>
        <AntdRegistry>{children}</AntdRegistry>
      </body>
    </html>
  );
}
