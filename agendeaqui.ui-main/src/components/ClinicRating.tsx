import React from "react";
import Image from "next/image";
import { StarFilled } from "@ant-design/icons";
import { Typography } from "antd";
const { Text } = Typography;

interface ClinicRatingProps extends React.HTMLAttributes<HTMLDivElement> {
  rating: number;
}

const ClinicRating: React.FC<ClinicRatingProps> = ({
  rating,
  className,
  ...props
}: ClinicRatingProps) => {
  return (
    <>
      <div
        className={`flex items-center justify-center ${className ?? ""}`}
        {...props}
      >
        <StarFilled style={{ color: "#F5BD4C", fontSize: 14 }} />
        <Text className="text-[#936200] ml-2 text-base font-normal">
          {(rating || 0).toFixed(1)}
        </Text>
        <Text></Text>
      </div>
    </>
  );
};

export default ClinicRating;
