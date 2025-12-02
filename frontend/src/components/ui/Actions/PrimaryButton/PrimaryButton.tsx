import React from "react";

type PrimaryButtonProps = {
  type?: "button" | "submit" | "reset";
  children: React.ReactNode;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
  size?: "sm" | "md";
  variant?: "solid" | "outline" | "danger";
  fullWidth?: boolean;
};

export default function PrimaryButton({
  type = "button",
  children,
  disabled = false,
  onClick,
  className = "",
  size = "sm",
  variant = "solid",
  fullWidth = false,
}: PrimaryButtonProps) {
  const base =
    "inline-flex items-center justify-center rounded-lg font-semibold transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 text-sm";

  const sizes = {
    sm: "px-3 py-2",
    md: "px-4 py-2.5",
  };

  const variants = {
    solid: "bg-cyan-600 text-white hover:bg-cyan-700 focus:ring-cyan-500",
    outline:
      "border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-cyan-500",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
  };

  const width = fullWidth ? "w-full" : "w-auto";

  const classes = [
    base,
    sizes[size],
    variants[variant],
    width,
    disabled ? "opacity-50 cursor-not-allowed" : "",
    className,
  ].join(" ");

  return (
    <button type={type} className={classes} disabled={disabled} onClick={onClick}>
      {children}
    </button>
  );
}

