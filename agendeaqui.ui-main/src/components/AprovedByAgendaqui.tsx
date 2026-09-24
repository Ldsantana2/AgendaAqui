import React from "react";
import Image from "next/image";

interface AprovedByAgendaquiProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

const AprovedByAgendaqui: React.FC<AprovedByAgendaquiProps> = ({
  className,
  ...props
}) => {
  return (
    <div
      {...props}
      className={`absolute top-2 right-2 bg-[#2D39A6] text-white px-2 py-1 rounded-lg flex items-center gap-2 text-xs font-bold whitespace-nowrap ${className ?? ""}`}
    >
      <span className="inline-block align-middle mr-1">
        <Image
          src="/images/checkicon.png"
          alt="ícone de check"
          width={16}
          height={16}
        />
      </span>
      <span className="inline-block align-middle">Aprovado pela Agendaqui</span>
    </div>
  );
};

export default AprovedByAgendaqui;
