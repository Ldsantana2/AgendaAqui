"use client";

import React, { ReactNode } from "react";

interface ProfileViewCardProps {
  title: string;
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  titleClassName?: string;
  titleStyle?: React.CSSProperties;
  titleBottomMarginClass?: string;
}

export default function ProfileViewCard({
  title,
  children,
  className = "",
  style,
  titleClassName = "",
  titleStyle,
  titleBottomMarginClass = "mb-4",
}: ProfileViewCardProps) {
  return (
    <div
      className={`w-full info-box p-4 rounded-md shadow-md bg-white relative ${className}`}
      style={style}
    >
      <div
        className={`flex justify-between items-center ${titleBottomMarginClass}`}
      >
        <h2
          className={`text-xl text-gray-800 ${titleClassName}`}
          style={titleStyle}
        >
          {title}
        </h2>
      </div>

      {children}
    </div>
  );
}
