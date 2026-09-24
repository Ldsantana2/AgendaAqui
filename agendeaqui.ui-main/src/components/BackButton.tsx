// components/BackButton.tsx
import { Button } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";

export default function BackButton({ href }: { href?: string }) {
  const router = useRouter();
  return (
    <Button
      shape="circle"
      size="large"
      icon={<ArrowLeftOutlined />}
      onClick={() => (href ? router.push(href) : router.back())}
      style={{
        position: "fixed",
        top: 16,
        left: 16,
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
        color: "#283277",
        borderColor: "#283277",
        zIndex: 1000,
      }}
    />
  );
}
