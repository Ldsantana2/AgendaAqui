import { Alert, Button, Card, Tooltip } from "antd";
import Link from "next/link";
import { ReactNode } from "react";
import { ArrowLeftOutlined } from "@ant-design/icons";

interface MainLayoutProps {
  children: ReactNode;
  className?: string;
  error?: string;
}
export default function RegisterLayout({ children, error }: MainLayoutProps) {
  return (
    <div className="min-h-screen">
      <div className="flex items-center justify-center min-h-fit bg-white p-4">
        <Card className="w-full max-w-2xl relative pt-12 px-6 pb-6">
          {/* Botão voltar fixo no topo esquerdo */}
          <Link href="/" className="absolute top-4 left-4">
            <Tooltip>
              <Button
                shape="circle"
                size="large"
                icon={<ArrowLeftOutlined />}
                style={{
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
                  color: "#2D39A6",
                  borderColor: "#2D39A6",
                }}
              />
            </Tooltip>
          </Link>

          <h1 className="text-3xl font-semibold text-center mb-6 text-[#2D39A6]">
            Cadastro
          </h1>

          {error && (
            <Alert message={error} type="error" showIcon className="mb-6" />
          )}

          {children}
        </Card>
      </div>
    </div>
  );
}
