import React from "react";
interface IconComponentProps {
  stroke?: string;
  fill?: string;
  className?: string;
  [key: string]: any;
}

interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: "primary" | "secondary" | "outline";
  size?: "small" | "medium" | "large";

  iconStart?: React.ReactElement<IconComponentProps>;
  iconEnd?: React.ReactElement<IconComponentProps>;
  className?: string;
  style?: React.CSSProperties;

  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  label,
  onClick,
  variant = "primary",
  size = "medium",
  iconStart,
  iconEnd,
  className = "",
  style,
  fullWidth,
}) => {
  let baseClasses =
    "flex items-center justify-center transition duration-300 rounded-lg";

  let widthClasses = "";
  if (fullWidth === true) {
    widthClasses = "w-full";
  } else if (fullWidth === false) {
    widthClasses = "";
  } else {
    widthClasses = "w-full md:w-auto";
  }
  baseClasses += ` ${widthClasses}`;

  let sizeClasses = "";
  switch (size) {
    case "small":
      sizeClasses = "py-1 px-3 text-sm h-8";
      break;
    case "medium":
      sizeClasses = "py-2 px-4 text-base h-10";
      break;
    case "large":
      sizeClasses = "py-3 px-6 text-lg h-12";
      break;
  }

  let variantClasses = "";
  let textColor = "";
  let hoverBgClass = "";

  switch (variant) {
    case "primary":
      variantClasses = "bg-[#2D39A6]";
      textColor = "#FFFFFF";
      hoverBgClass = "hover:bg-[#283277]";
      break;

    case "secondary":
      variantClasses = "bg-gray-200";
      textColor = "#2E2A2A";
      hoverBgClass = "hover:bg-gray-300";
      break;
    case "outline":
      variantClasses = "bg-white border-[1.6px] border-[#C2C2C2]";
      textColor = "#2E2A2A";
      hoverBgClass = "hover:bg-gray-100";
      break;
  }

  const gapClass = "gap-2";

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${sizeClasses} ${variantClasses} ${hoverBgClass} ${gapClass} ${className}`}
      style={style}
    >
      {iconStart && (
        <span style={{ flexShrink: 0 }}>
          {React.cloneElement(iconStart, {
            stroke: textColor,
            fill: "none",
            className: iconStart.props.className || "",
          })}
        </span>
      )}
      <span
        style={{
          fontFamily: "Inter",
          fontWeight: 500,
          lineHeight: "100%",
          letterSpacing: "0%",
          color: textColor,
          whiteSpace: "nowrap",
          textOverflow: "ellipsis",
        }}
      >
        {label}
      </span>
      {iconEnd && (
        <span style={{ flexShrink: 0 }}>
          {React.cloneElement(iconEnd, {
            stroke: textColor,
            fill: "none",
            className: iconEnd.props.className || "",
          })}
        </span>
      )}
    </button>
  );
};

export default Button;
